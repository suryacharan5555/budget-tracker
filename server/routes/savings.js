import express from 'express';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get savings data
router.get('/', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate current month's expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expenses = await Expense.find({
      userId: req.user.userId,
      date: { $gte: startOfMonth }
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentSavings = budget.monthlyIncome - totalExpenses;
    const savingsGoal = budget.savingsGoal;
    const monthlySavings = currentSavings > 0 ? currentSavings : 0;

    // Generate savings recommendations
    const recommendations = [];
    const savingsRatio = (monthlySavings / budget.monthlyIncome) * 100;

    if (savingsRatio < 20) {
      recommendations.push('Try to save at least 20% of your monthly income');
    }
    if (totalExpenses > budget.monthlyIncome * 0.8) {
      recommendations.push('Your expenses are high. Consider reviewing non-essential expenses');
    }
    if (monthlySavings < savingsGoal) {
      const deficit = savingsGoal - monthlySavings;
      recommendations.push(`You're ₹${deficit} below your savings goal. Look for areas to reduce spending`);
    }
    if (monthlySavings >= savingsGoal) {
      recommendations.push('Great job! You\'re meeting or exceeding your savings goal');
    }

    res.json({
      currentSavings,
      savingsGoal,
      monthlySavings,
      recommendations
    });
  } catch (err) {
    console.error('Savings calculation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
