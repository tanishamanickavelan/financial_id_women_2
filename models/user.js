const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  income: { type: Number },
  trustScore: { type: Number },
  txnHash: { type: String },
  nationalID: { type: String },
  email: { type: String },
  walletAddress: { type: String }
});

module.exports = mongoose.model("User", UserSchema);
