const User = require("../model/User");
const redis = require('../config/redis');

const createTransaction = async (req, res) => {
  const { transactionAmount, transactionName, transactionDate } = req.body;

  if (!transactionAmount || !transactionName) {
    return res.status(400).json({ message: "Required field(s) missing" });
  }
  
  const findUser = await User.findOne({ username: req.user }).exec();
  if (!findUser) return res.sendStatus(403);

  findUser.transactions.push({
    amount: transactionAmount,
    what: transactionName,
    when: transactionDate ? transactionDate : new Date(),
  });
  const result = await findUser.save();
  console.log(result);
  // send all transactions back to client
  return res.status(201).json(result.transactions);
};

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ message: "Required field(s) missing" });
  }
  const user = await User.findOne({ username: req.user }).exec();
  if (!user) return res.sendStatus(403);
  try {
    await user.transactions.pull({ _id: transactionId });
    await user.save();
    // send all transactions back to client
    return res.status(200).json(user.transactions);
  } catch (err) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }
};

const getAllTransactions = async (req, res) => {
  if (await redis.get(`user-${req.user}`) !== null) {
    return await redis.get(`user-${req.user}`)
      .then((result) => {
        return res.status(200).json(JSON.parse(result));
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });
  }
     User.findOne({ username: req.user })
    .then(async (user) => {
      if (!user) return res.sendStatus(403);
      await redis.set(`user-${req.user}`, JSON.stringify(user.transactions));
      return res.status(200).json(user.transactions);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
}

module.exports = { createTransaction, deleteTransaction, getAllTransactions };
