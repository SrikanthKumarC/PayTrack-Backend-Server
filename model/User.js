const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  transactions: [
    { amount: Number, when: { type: Date, default: Date.now }, what: String },
  ],
  debt: [{ amount: Number, what: String, period: Number, interest: Number }],
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
