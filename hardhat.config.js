require("@nomiclabs/hardhat-waffle");

const infura_projectId = "403f2033226a44788c2638cc1c29d438"
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey]
    },
    polygon_mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
