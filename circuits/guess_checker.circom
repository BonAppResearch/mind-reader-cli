pragma circom 2.0.0; 

include "util.circom";

template GuessChecker(n) { 
   signal input solution[n]; 
   signal input guess[n];

   signal output guess_norm_sq;
   signal output dot_product;
   
   signal output solution_hash;
   signal output guess_hash;
   
   component guess_norm_squared = NormSquared(n);

   component dot = DotProduct(n);

   component solution_mimc = MultiMiMC7(n, 91);
   component guess_mimc = MultiMiMC7(n, 91);

   solution_mimc.k <== 0;
   guess_mimc.k <== 0;

   for (var i=0; i < n; i++) {
      guess_norm_squared.a[i] <== guess[i];

      dot.a[i] <== solution[i];
      dot.b[i] <== guess[i];

      solution_mimc.in[i] <== solution[i];
      guess_mimc.in[i] <== guess[i];
   }
   guess_norm_sq <== guess_norm_squared.out;
   dot_product <== dot.out;

   solution_hash <== solution_mimc.out;
   guess_hash <== guess_mimc.out;
}

component main = GuessChecker(512);