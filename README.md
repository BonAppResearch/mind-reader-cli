# mind-reader-cli
Sentence guessing game based on ML and coSNARKs

> [!NOTE]
> This repo is a single-machine CLI demo of the Mind Reader game. The actual game should be deployed on a coSNARK MPC network such as [TACEO](https://taceo.io).

This project originates from the idea that we can create a fun game for users to guess a prompt that generates a target image, inspired by [Unveiling Emotions](https://www.unveilingemotions.com/photo/1). However, due to the limitations of zkML to prove large generative models, we have to simplify the game to a mind-reading game, which is to guess the sentence that the creator is thinking of.

## Components

### node.js CLI app

The CLI app is a simple node.js app that allows you to play the Mind Reader game. It encodes the solution and guesses into embeddings using the Universal Sentence Encoder, and then proves the solution and guess using the Codemaker and Guesser circuits respectively. The game stops when the guess is close enough to the solution (cosine similarity > 0.9).

### Codemaker circuit

The Codemaker circuit encodes the solution sentence into a hash and computes the squared norm of the sentence.

### Guesser circuit

The Guesser circuit encodes the guess sentence into a hash and computes the dot product of the guess with the solution.


## How to play

1. Clone the repo
```
git clone https://github.com/taceo-io/mind-reader-cli.git
```

2. Install dependencies
```
bash setup.sh
npm install
```

3. Start the game
```
npm start
```