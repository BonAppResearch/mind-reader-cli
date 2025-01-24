# install Circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# install coCircom
cd ..
git clone https://github.com/TaceoLabs/co-snarks.git
cd co-snarks
cd co-circom
cargo build --release
cargo install --path co-circom

# install npm dependencies
npm install

# compile circuits
cd circuits
bash compile.sh
