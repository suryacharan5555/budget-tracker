import express from 'express';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's budget
router.get('/', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update budget
router.post('/', auth, async (req, res) => {
  try {
    const { monthlyIncome, mandatoryExpenses, savingsGoal, daysInMonth } = req.body;

    let budget = await Budget.findOne({ userId: req.user.userId });

    if (budget) {
      budget.monthlyIncome = monthlyIncome;
      budget.mandatoryExpenses = mandatoryExpenses;
      budget.savingsGoal = savingsGoal;
      budget.daysInMonth = daysInMonth;
    } else {
      budget = new Budget({
        userId: req.user.userId,
        monthlyIncome,
        mandatoryExpenses,
        savingsGoal,
        daysInMonth,
      });
    }

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
