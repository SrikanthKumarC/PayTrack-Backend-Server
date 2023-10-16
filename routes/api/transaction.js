const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/transactionController");



router.post("/createTransaction", transactionController.createTransaction);
router.delete("/deleteTransaction", transactionController.deleteTransaction);
router.get('/transactions', transactionController.getAllTransactions)
module.exports = router;
