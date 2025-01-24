pragma circom 2.0.0; 

include "util.circom";

// circuit for proposing a puzzle (solution)

template Codemaker(n) {
    signal input solution[n];

    signal output norm_sq;
    signal output hash;

    // check each element of solution is in the range [-10^9, 10^9] to prevent overflow attacks
    for (var i = 0; i < n; i++) {
        assert(solution[i] < 1000000000); // 10^9 is the scaling factor
        assert(solution[i] > -1000000000);
    }

    component norm_squared = NormSquared(n);
    component mimc = MultiMiMC7(n, 91);

    mimc.k <== 0;

    for (var i = 0; i < n; i++) {
        norm_squared.a[i] <== solution[i];
        mimc.in[i] <== solution[i];
    }

    norm_sq <== norm_squared.out;
    hash <== mimc.out;  
}

component main = Codemaker(512);