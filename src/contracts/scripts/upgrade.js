const { ethers, upgrades } = require("hardhat")

async function main() {
    const phoneLinks = await ethers.getContractFactory("phoneLink")
    //let proxy = await upgrades.upgradeProxy("0x6Ee89F6d43fd9d40dbB3cDbCA1692c99A090f72C", phoneLinks) //mumbai (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0xc62773E07ab521DB2366Ea441D47ccFA6F15c005", phoneLinks); //rinkeby (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", phoneLinks); //Matic mainnet
    let proxy = await upgrades.upgradeProxy("0x588e0570DD24a8CFFDF1fC43840f77Ca7C7c9499", phoneLinks) //Kardiachain testnet (proxy)
    console.log("Contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
