import mongoose from 'mongoose';

async function checkMongoConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/budget-tracker');
    console.log('Successfully connected to MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

checkMongoConnection();
