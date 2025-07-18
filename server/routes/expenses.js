import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all expenses for a user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, description, tags } = req.body;

    const expense = new Expense({
      userId: req.user.userId,
      amount,
      category,
      description,
      tags,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, category, description, tags } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.amount = amount;
    expense.category = category;
    expense.description = description;
    expense.tags = tags;

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
