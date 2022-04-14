const hre = require("hardhat");

async function main() {

  const phoneLinks = await hre.ethers.getContractFactory("phoneLink");
  const phoneLink = await phoneLinks.deploy();
  await phoneLink.deployed();
  console.log("phoneLinks deployed to:", phoneLink.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
