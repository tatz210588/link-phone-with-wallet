const { ethers, upgrades } = require("hardhat")

async function main() {
    const phoneLinks = await ethers.getContractFactory("phoneLink")
    let proxy = await upgrades.upgradeProxy("0xCF14441150e927F80eC771d9b002E7b25b5F85C6", phoneLinks) //mumbai (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0xc62773E07ab521DB2366Ea441D47ccFA6F15c005", phoneLinks); //rinkeby (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", phoneLinks); //Matic mainnet
    //let proxy = await upgrades.upgradeProxy("0xFF1F17F3429aCee72F2bA1420F63BF6deE25DcdB", phoneLinks); //Kardiachain testnet (proxy)
    console.log("Contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
