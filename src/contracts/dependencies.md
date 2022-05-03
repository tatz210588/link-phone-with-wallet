***for deploying script:*** npx hardhat run scripts/deploy.js --network mumbai
   for verifying script:  npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"

***if verify code poses any error, delete artifacts folder and run "npx hardhat compile". Now running the verify script will work fine***

Upgrades plugin: npm install @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers