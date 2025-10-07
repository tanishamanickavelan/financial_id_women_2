const { ethers } = require("ethers");
require("dotenv").config();

// Use Mumbai testnet RPC
const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_MUMBAI_URL || 
  process.env.INFURA_MUMBAI_URL || 
  'https://rpc-mumbai.maticvigil.com'
);

const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || '', provider);

// Minimal ABI that matches createUser & getUserByWallet & updateTrustScore
const contractABI = [
  "function createUser(address _wallet, string calldata _name, string calldata _cid, uint256 _trustScore) external returns (uint256)",
  "function getUserByWallet(address _wallet) external view returns (tuple(string name,address wallet,string cid,uint256 trustScore,uint256 createdAt))",
  "function updateTrustScore(uint256 _id, uint256 _trustScore) external",
];

const contractAddress = process.env.CONTRACT_ADDRESS || '';

if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️  CONTRACT_ADDRESS not set in env - you need to deploy the contract first');
  console.warn('Run: npm run compile && npm run deploy');
}

// Create a mock contract object that won't crash the server
const contract = contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000' 
  ? new ethers.Contract(contractAddress, contractABI, wallet)
  : {
      createUser: async () => { throw new Error('Contract not deployed. Run: npm run deploy'); },
      getUserByWallet: async () => { throw new Error('Contract not deployed. Run: npm run deploy'); },
      updateTrustScore: async () => { throw new Error('Contract not deployed. Run: npm run deploy'); }
    };

module.exports = contract;