const express = require("express");
const router = express.Router();
const User = require("../../model/User");

router.post("/createDebt", async (req, res) => {
  const { debtName, debtAmount, debtPeriod, debtInterest } = req.body;

  if (!debtName || !debtAmount || !debtPeriod || !debtInterest) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const findUser = await User.findOne({ username: req.user }).exec();
  if (!findUser) return res.sendStatus(403);

  findUser.debt.push({
    what: debtName,
    amount: debtAmount,
    period: debtPeriod,
    interest: debtInterest,
  });
  const result = await findUser.save();
  console.log(result);
  // send all debts back to client
  return res.status(201).json(result.debt);
});

router.post("/deleteDebt", async (req, res) => {
  const { debtId } = req.body;
  if (!debtId) {
    return res.status(400).json({ msg: "Required field(s) missing" });
  }

  const findUser = await User.findOne({ username: req.user }).exec();
  if (!findUser) return res.sendStatus(403);
  try {
    await findUser.debt.pull({ _id: debtId });
    await findUser.save();
    // send all debts back to client
    return res.status(200).json(findUser.debt);
  } catch (err) {
    return res.status(400).json({ msg: "Invalid debt ID" });
  }
});

router.get("/debts", async (req, res) => {
  User.findOne({ username: req.user })
    .then((user) => {
      if (!user) return res.sendStatus(403);
      return res.status(200).json(user.debt);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});
module.exports = router;
