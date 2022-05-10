const { ethers, upgrades } = require("hardhat")

async function main() {
    const phoneLinks = await ethers.getContractFactory("phoneLink")
    let proxy = await upgrades.upgradeProxy("0x0221c5432fE9732b973F3282bE599fC1cB997cd6", phoneLinks) //mumbai
    //let proxy = await upgrades.upgradeProxy("0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", phoneLinks); //rinkeby
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
