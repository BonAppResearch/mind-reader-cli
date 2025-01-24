# download the ptau file if not exists
if [ ! -f "powersOfTau28_hez_final_19.ptau" ]; then
    wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_19.ptau
fi



# compile codemaker circuit
circom codemaker.circom --r1cs

# generate a new zkey (in reality, will likely use plonk)
snarkjs groth16 setup codemaker.r1cs powersOfTau28_hez_final_19.ptau codemaker.zkey

# export the verification key
snarkjs zkey export verificationkey codemaker.zkey codemaker_key.json



# compile guess checker circuit
circom guess_checker.circom --r1cs

# generate a new zkey (in reality, will likely use plonk)
snarkjs groth16 setup guess_checker.r1cs powersOfTau28_hez_final_19.ptau guess_checker.zkey

# export the verification key
snarkjs zkey export verificationkey guess_checker.zkey guess_checker_key.json