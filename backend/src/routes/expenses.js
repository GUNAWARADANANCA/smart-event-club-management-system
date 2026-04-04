const express = require('express');
const Expense = require('../models/Expense');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 }).lean();
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { event, item, amount, date } = req.body;
    const expense = await Expense.create({
      event,
      item,
      amount: Number(amount),
      date: date || new Date().toISOString().split('T')[0],
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
