import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Apartment } from '../models/Apartment.js';
import { User } from '../models/User.js';
import { apartments } from './apartments.js';
import { encryptString } from '../utils/crypto.js';

dotenv.config();

await connectDatabase();

await Apartment.deleteMany({});
await User.deleteMany({});

await Apartment.insertMany(apartments);
await User.create({
  name: 'Admin',
  email: 'admin@example.com',
  password: 'Admin@123456',
  role: 'admin',
  encryptedPhone: encryptString('0900000000')
});

console.log('Seed completed: apartments + admin@example.com / Admin@123456');
await mongoose.disconnect();
