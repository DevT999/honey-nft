require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/NFTMinter.sol/NFTMinter.json")
const contractAddress = "0xCa3a3c0f18b53b06D95E22121Be5cfe1981Da159"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

const subProcess = async (tx) => {
  return new Promise((resolve, reject)=>{
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
            resolve(true)
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
            reject(err)
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
      reject(err)
    })
  })
}
async function mintNFT(amount) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
  const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'data': nftContract.methods.mint(PUBLIC_KEY, amount).encodeABI()
  };
  await subProcess(tx);
  return 1
}

for(let i=0; i<5; i++) {
  setTimeout(() => mintNFT(2), i*20000);
}