const User = require("../models/user");

// Add new user (legacy)
exports.addUser = async (req, res) => {
  try {
    const { name, phone, income, trustScore, txnHash } = req.body;

    const user = new User({ name, phone, income, trustScore, txnHash, nationalID: '', email: '', walletAddress: '' });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
