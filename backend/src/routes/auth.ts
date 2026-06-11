import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/setup', async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashed });
    res.json({ message: 'Admin created. Username: admin, Password: admin123' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
