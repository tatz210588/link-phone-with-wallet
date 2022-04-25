const { ethers, upgrades } = require("hardhat");


async function main() {

  const phoneLinks = await ethers.getContractFactory("phoneLink");
  const proxy = await upgrades.deployProxy(phoneLinks);
  //const phoneLink = await phoneLinks.deploy();
  //await phoneLink.deployed();
  console.log("phoneLinks deployed to:", proxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
