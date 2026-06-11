import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import productRoutes from './routes/products';
import serviceRoutes from './routes/services';
import dashboardRoutes from './routes/dashboard';
import User from './models/User';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

async function getMongoUri(): Promise<string> {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  console.log('Using in-memory MongoDB (dev mode)');
  return mongod.getUri();
}

async function seedAdmin() {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashed });
    console.log('Admin user created — username: admin, password: admin123');
  }
}

getMongoUri().then(uri =>
  mongoose.connect(uri).then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
