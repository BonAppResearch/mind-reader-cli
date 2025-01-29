const fs = require('fs');
const runCommand = require('./runCommand');


const proveCodemaker = async () => {
    // create "out/codemaker" folder
    if (!fs.existsSync('out/codemaker')) {
        fs.mkdirSync('out/codemaker');
    }

    console.log("Proving solution in codemaker circuit...");
    
    await runCommand(`co-circom split-input --circuit circuits/codemaker.circom --input out/solution.json --protocol REP3 --curve BN254 --out-dir out/`);
    console.log("Split input done");

    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom generate-witness --input out/solution.json.${i}.shared --circuit circuits/codemaker.circom --protocol REP3 --curve BN254 --config configs/party${i+1}.toml --out out/codemaker/witness.wtns.${i}.shared`);
        })
    );
    console.log("Witness generated");
    
    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom generate-proof groth16 --witness out/codemaker/witness.wtns.${i}.shared --zkey circuits/codemaker.zkey --protocol REP3 --curve BN254 --config configs/party${i+1}.toml --out out/codemaker/proof.${i}.json --public-input out/codemaker/public_input.${i}.json`);
        })
    );
    console.log("Proof generated");
    
    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom verify groth16 --proof out/codemaker/proof.${i}.json --vk circuits/codemaker_key.json --public-input out/codemaker/public_input.${i}.json --curve BN254`);
        })
    );
    console.log("Codemaker proof verified");

    // read from out/codemaker/public_input.0.json and return the array
    const publicInput = JSON.parse(fs.readFileSync('out/codemaker/public_input.0.json', 'utf8'));
    return publicInput;
}

const proveGuessChecker = async () => {
    // create "out/guess_checker" folder
    if (!fs.existsSync('out/guess_checker')) {
        fs.mkdirSync('out/guess_checker');
    }

    console.log("Proving solution in guess_checker circuit...");
    
    await runCommand(`co-circom split-input --circuit circuits/guess_checker.circom --input out/guess.json --protocol REP3 --curve BN254 --out-dir out/`);
    console.log("Split input done");

    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom merge-input-shares --inputs out/solution.json.${i}.shared --inputs out/guess.json.${i}.shared --protocol REP3 --curve BN254 --out out/input.json.${i}.shared`);
        })
    );
    console.log("Merge input done");
    
    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom generate-witness --input out/input.json.${i}.shared --circuit circuits/guess_checker.circom --protocol REP3 --curve BN254 --config configs/party${i+1}.toml --out out/guess_checker/witness.wtns.${i}.shared`);
        })
    );
    console.log("Witness generated");
    
    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom generate-proof groth16 --witness out/guess_checker/witness.wtns.${i}.shared --zkey circuits/guess_checker.zkey --protocol REP3 --curve BN254 --config configs/party${i+1}.toml --out out/guess_checker/proof.${i}.json --public-input out/guess_checker/public_input.${i}.json`);
        })
    );
    console.log("Proof generated");

    await Promise.all(
        Array.from({ length: 3 }, (_, i) => {
            return runCommand(`co-circom verify groth16 --proof out/guess_checker/proof.${i}.json --vk circuits/guess_checker_key.json --public-input out/guess_checker/public_input.${i}.json --curve BN254`);
        })
    );
    console.log("Guess checker proof verified");

    // read from out/guess_checker/public_input.0.json and return the array
    const publicInput = JSON.parse(fs.readFileSync('out/guess_checker/public_input.0.json', 'utf8'));
    return publicInput;
    
}

module.exports = {
    proveCodemaker,
    proveGuessChecker
}