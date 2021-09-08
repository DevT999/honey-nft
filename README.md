# npm install

# environment variables set
API_URL: get from alchemyapi project
PRIVATE_KEY: Your wallet private key
PUBLIC_KEY: Your wallet address

# compile contract

npx hardhat compile

# deploy 

npx hardhat run scripts/deploy.js --network {network name}

# mint
before minting, set contractAddress as the result address from deployment and run below
node scripts/mint-nft.js

### on NFTMinter.sol, set NFT name and unit