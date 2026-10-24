import mongoose from 'mongoose';

let cachedPromise = null;

export async function connectDB(uri) {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((conn) => {
        console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
        return conn;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error('❌ MongoDB connection error:', err.message);
        if (!process.env.VERCEL) {
          process.exit(1);
        }
        throw err;
      });
  }

  return cachedPromise;
}
