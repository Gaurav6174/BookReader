import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
}
