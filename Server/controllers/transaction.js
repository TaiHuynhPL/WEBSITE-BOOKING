const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res, next) => {
  const { hotel, room, dateStart, dateEnd, price, payment, status } = req.body;
  const user = req.params.userId;
  try {
    const transaction = new Transaction({
      user,
      hotel,
      room,
      dateStart,
      dateEnd,
      price,
      payment,
      status,
    });
    const saveTransaction = await transaction.save();
    res.status(200).json(saveTransaction);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const transactions = await Transaction.find({ user: userId })
      .populate("user")
      .populate("hotel");
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getLastestTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate("user")
      .populate("hotel")
      .sort({ createdAt: -1 })
      .limit(8);
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate("user")
      .populate("hotel")
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};
