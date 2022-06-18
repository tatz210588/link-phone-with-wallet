const { ethers } = require("hardhat")


async function main() {

    const naivepaymaster = await ethers.getContractFactory("NaivePaymaster")
    //const proxy = await upgrades.deployProxy(phoneLinks)
    const paymaster = await naivepaymaster.new()
    await paymaster.deployed()
    console.log("phoneLinks deployed to:", paymaster.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
