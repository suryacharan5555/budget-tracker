import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import authRoutes from '../server/routes/auth.js';
import expenseRoutes from '../server/routes/expenses.js';
import budgetRoutes from '../server/routes/budget.js';
import savingsRoutes from '../server/routes/savings.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (reuse if already connected)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB || process.env.MONGODB_URL || 'mongodb://localhost:27017/budget-tracker';

let isConnected = false;

async function connect() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true, // mongoose v6+ uses these by default
      // useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB (serverless)');
  } catch (err) {
    console.error('MongoDB connection error (serverless):', err);
  }
}

connect();

// Mount routes at root; this catch-all function is mounted at /api/* by Vercel
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);
app.use('/savings', savingsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default serverless(app);
