const User = require("../model/User");

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
  res.sendStatus(201);
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
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }
};

const getAllTransactions = (req, res) => {
  User.findOne({ username: req.user })
    .then((user) => {
      if (!user) return res.sendStatus(403);
      return res.status(200).json(user.transactions);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
}

module.exports = { createTransaction, deleteTransaction, getAllTransactions };
