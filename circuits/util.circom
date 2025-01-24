pragma circom 2.0.0; 

include "../node_modules/circomlib-matrix/circuits/matElemMul.circom";
include "../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../node_modules/circomlib/circuits/mimc.circom";

template NormSquared(n) {
   signal input a[n];
   signal output out;

   component square = matElemMul(n, 1);
   component sum = matElemSum(n, 1);

   for (var i=0; i < n; i++) {
      square.a[i][0] <== a[i];
      square.b[i][0] <== a[i];
   }

   for (var i=0; i < n; i++) {
      sum.a[i][0] <== square.out[i][0];
   }

   out <== sum.out;
}

template DotProduct(n) {
   signal input a[n];
   signal input b[n];
   signal output out;

   component dot = matElemMul(n, 1);
   component sum = matElemSum(n, 1);

   for (var i=0; i < n; i++) {
      dot.a[i][0] <== a[i];
      dot.b[i][0] <== b[i];
   }

   for (var i=0; i < n; i++) {
      sum.a[i][0] <== dot.out[i][0];
   }

   out <== sum.out;
}