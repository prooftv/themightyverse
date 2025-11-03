const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("MightyVerseAssets");
  const contract = await Factory.deploy("MightyVerse", "MV");
  await contract.deployed();
  console.log("MightyVerseAssets deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
