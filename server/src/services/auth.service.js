import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { conflictError } from '../middleware/validate.js';

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw conflictError('An account with this email address already exists.');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const token = generateToken(user);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

export async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }
  return user;
}
