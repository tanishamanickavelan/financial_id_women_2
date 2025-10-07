require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_URL || process.env.INFURA_MUMBAI_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : []
    }
  }
};
