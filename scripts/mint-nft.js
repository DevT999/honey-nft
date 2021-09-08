require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/NFTMinter.sol/NFTMinter.json")
const contractAddress = "0x1cf874138e55007Cbf4374FC2fD9869844F7Af1a"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// const subProcess = async (tx) => {
//   return new Promise((resolve, reject)=>{
//     web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then((signedTx) => {
//       web3.eth.sendSignedTransaction(
//         signedTx.rawTransaction,
//         function (err, hash) {
//           if (!err) {
//             console.log(
//               "The hash of your transaction is: ",
//               hash,
//               "\nCheck Alchemy's Mempool to view the status of your transaction!"
//             )
//             resolve(true)
//           } else {
//             console.log(
//               "Something went wrong when submitting your transaction:",
//               err
//             )
//             reject(err)
//           }
//         }
//       )
//     })
//     .catch((err) => {
//       console.log(" Promise failed:", err)
//       reject(err)
//     })
//   })
// }

async function mintNFT(amount) {
  const account = web3.eth.accounts.privateKeyToAccount(`0x${PRIVATE_KEY}`);
  web3.eth.accounts.wallet.add(account);
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
  web3.eth.defaultAccount = account.address;
  nftContract.methods.mint(PUBLIC_KEY, amount).send({from: PUBLIC_KEY, value: 0, gas: 6000000, nonce: nonce}).on('receipt', function(receipt){
    console.log('success');
  });
  //const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
  // const tx = {
  //     'from': PUBLIC_KEY,
  //     'to': contractAddress,
  //     'nonce': nonce,
  //     'gas': 500000,
  //     'data': nftContract.methods.mint(PUBLIC_KEY, amount).encodeABI()
  // };
  // await subProcess(tx);
  return 1
}

for(let i=0; i<900; i++) {
  setTimeout(()=>mintNFT(1), i*20000)
}