const { ethers, upgrades } = require("hardhat")

async function main() {
    const phoneLinks = await ethers.getContractFactory("phoneLink")
    //let proxy = await upgrades.upgradeProxy("0x6Ee89F6d43fd9d40dbB3cDbCA1692c99A090f72C", phoneLinks) //mumbai (proxy deployed)
    let proxy = await upgrades.upgradeProxy("0xF09f5824c693804Be9573f5f75f7d3f0F97e1437", phoneLinks); //rinkeby (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", phoneLinks); //Matic mainnet
    //let proxy = await upgrades.upgradeProxy("0x588e0570DD24a8CFFDF1fC43840f77Ca7C7c9499", phoneLinks) //Kardiachain testnet (proxy)
    //let proxy = await upgrades.upgradeProxy("0xdD7Fa6c4BDC6B48859C88a28ad1b9A7993991a81", phoneLinks) //Kardiachain Main (proxy)
    console.log("Contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
