async function main() {
    const NFTMinter = await ethers.getContractFactory("NFTMinter")
  
    // Start deployment, returning a promise that resolves to a contract object
    const myNFT = await NFTMinter.deploy()
    console.log("Contract deployed to address:", myNFT.address)
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
})
  