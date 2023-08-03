const express = require("express");

const router = express.Router();

const {
  getTransactions,
  createTransaction,
  getLastestTransactions,
  getAllTransactions
} = require("../controllers/transaction");

router.post("/:userId", createTransaction);

router.get("/lastest", getLastestTransactions);

router.get("/:userId", getTransactions);

router.get('/',getAllTransactions)

module.exports = router;
