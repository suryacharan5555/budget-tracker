import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  monthlyIncome: {
    type: Number,
    required: true,
  },
  mandatoryExpenses: {
    type: Number,
    required: true,
  },
  savingsGoal: {
    type: Number,
    required: true,
  },
  daysInMonth: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
