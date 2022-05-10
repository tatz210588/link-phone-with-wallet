const { ethers, upgrades } = require("hardhat")

async function main() {
    const phoneLinks = await ethers.getContractFactory("phoneLink")
    let proxy = await upgrades.upgradeProxy("0xc577F566D73851F945acbA2Def79884ea0B29818", phoneLinks) //mumbai (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0xc62773E07ab521DB2366Ea441D47ccFA6F15c005", phoneLinks); //rinkeby (proxy deployed)
    //let proxy = await upgrades.upgradeProxy("0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", phoneLinks); //Matic mainnet
    console.log("Contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
