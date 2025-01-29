const logo = require('asciiart-logo');
const config = require('../package.json');
console.log(logo(config).render());

require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fs = require('fs');
const prompt = require('prompt-sync')();
const assert = require('assert').strict;

const convertInput = require('./utils/convertInput');
const { proveCodemaker, proveGuessChecker } = require('./utils/cocircom');

// create "out" folder
if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
}

const main = async () => {
    
    // parallelize loading the model while asking for user input for solution sentence with prompt 'Start a new game by setting the solution sentence"
    const [model, solutionSentence] = await Promise.all([
        use.load(),
        prompt('Start a new game by setting the solution sentence: ', { echo: '*' })
    ]);
    
    // encode the solution sentence
    const solutionEmbedding = await model.embed([solutionSentence]);

    solutionEmbedding.array().then(array => {
        // save the FLATTENED array to a json file with the key "solution" and the name "solution.json"
        fs.writeFileSync('out/solution.json', JSON.stringify({ solution: convertInput(array.flat()) }, null, 2));
    });

    // prove the codemaker
    const [solutionNormSquared, hash] = await proveCodemaker();

    console.log("Solution norm:", solutionNormSquared);
    console.log("Solution hash:", hash);

    let similarity = 0;
    while (similarity < 0.9) {
        // get user input for guess sentence
        const guessSentence = prompt('Enter your guess sentence: ');

        // encode the guess sentence
        const guessEmbedding = await model.embed([guessSentence]);

        guessEmbedding.array().then(array => {
            // save the FLATTENED array to a json file with the key "guess" and the name "guess.json"
            fs.writeFileSync('out/guess.json', JSON.stringify({ guess: convertInput(array.flat()) }, null, 2));
        });

        // prove the guess checker
        const [guessNormSquared, dotProduct, solutionHash, guessHash] = await proveGuessChecker();
        
        assert.equal(solutionHash, hash);
        console.log("Solution hashes match");
        
        similarity = dotProduct / Math.sqrt(guessNormSquared * solutionNormSquared);
        console.log("Cosine similarity:", similarity);
    }
    console.log("You win!");
}

main();