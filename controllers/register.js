const { pinJSON } = require('../utils/pinToPinata');
const contract = require('../contract');
const UserModel = require('../models/user');

function computeTrustScore(transactions) {
  // simple heuristic for MVP
  if (!transactions || transactions.length === 0) return 10;
  const credits = transactions.filter(t => t.type === 'credit' || (t.amount && t.amount > 0));
  const total = credits.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
  const months = 3;
  const avg = total / months;
  const score = Math.min(100, Math.round(Math.log10(avg + 1) * 20));
  return score || 10;
}

exports.register = async (req, res) => {
  try {
    const { walletAddress, name, email, transactions } = req.body;
    if (!walletAddress || !name) return res.status(400).json({ error: 'walletAddress and name required' });

    const trustScore = computeTrustScore(transactions);

    const profile = {
      name, email, walletAddress, trustScore, summary: { txCount: transactions ? transactions.length : 0 },
      createdAt: new Date().toISOString()
    };

    const cid = await pinJSON(profile);

    // send tx to contract (createUser)
    const tx = await contract.createUser(walletAddress, name, cid, trustScore);
    const receipt = await tx.wait ? await tx.wait() : tx; // ethers v5/v6 compatibility try

    // save in MongoDB
    const saved = await new UserModel({
      name, email, walletAddress, trustScore, txnHash: tx.hash || (receipt && receipt.transactionHash) || '',
      nationalID: '', phone: '', income: 0
    }).save();

    res.status(201).json({ success: true, cid, txHash: tx.hash || (receipt && receipt.transactionHash) || '', saved });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: err.message });
  }
};
