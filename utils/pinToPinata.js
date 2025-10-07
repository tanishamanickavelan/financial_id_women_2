const axios = require('axios');
require('dotenv').config();

async function pinJSON(json) {
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys not set in env');
  }

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', json, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
      }
    });
    
    return response.data.IpfsHash; // CID
  } catch (error) {
    console.error('Pinata API error:', error.response?.data || error.message);
    throw new Error(`Failed to pin to IPFS: ${error.response?.data?.error || error.message}`);
  }
}

module.exports = { pinJSON };