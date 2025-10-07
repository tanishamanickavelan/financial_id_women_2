const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test basic server health
    const healthResponse = await axios.get('http://localhost:4000/api/users');
    console.log('✅ Server is responding');
    console.log('Users endpoint status:', healthResponse.status);
    
    // Test register endpoint (this will fail due to contract not deployed, but API should respond)
    try {
      const registerResponse = await axios.post('http://localhost:4000/api/register', {
        walletAddress: '0x1234567890123456789012345678901234567890',
        name: 'Test User',
        email: 'test@example.com',
        transactions: [
          { type: 'credit', amount: 1000 },
          { type: 'debit', amount: 500 }
        ]
      });
      console.log('✅ Register endpoint working:', registerResponse.status);
    } catch (error) {
      if (error.response?.status === 500) {
        console.log('⚠️  Register endpoint responding (expected error due to contract not deployed)');
      } else {
        console.log('❌ Register endpoint error:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }
}

// Run test if server is running
setTimeout(testAPI, 2000);