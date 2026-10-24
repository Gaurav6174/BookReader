import { createApp } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let appInstance = null;

export default async function handler(req, res) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({
        error: { message: 'MONGODB_URI environment variable is not defined.' }
      });
    }

    await connectDB(mongoUri);

    if (!appInstance) {
      appInstance = createApp({
        clientOrigin: process.env.CLIENT_ORIGIN || '*'
      });
    }

    return appInstance(req, res);
  } catch (err) {
    console.error('Serverless API Error:', err);
    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
}
