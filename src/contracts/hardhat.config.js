require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')

const infura_projectId = '403f2033226a44788c2638cc1c29d438'
const fs = require('fs')
const privateKey = fs.readFileSync('.secret').toString()

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
      chainId: 80001,
    },
    polygon_mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    },
    kardiachain_main: {
      url: 'https://rpc.kardiachain.io',
      accounts: [privateKey],
    },
    kardiachain_test: {
      url: 'https://dev.kardiachain.io/',
      accounts: [privateKey],
    },
    aurora_testnet:{
      url: `https://aurora-testnet.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    },
    aurora_mainnet:{
      url: `https://near-mainnet.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    }
  },
  etherscan: {
    apiKey: '5PB2QWEDWRA9JBUWGBDHHZFM2X5YECC5Q2',
  },
  solidity: '0.8.4',
  paths: {
    artifacts: '../web/artifacts',
  },
}
