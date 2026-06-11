import { Router, Response } from 'express';
import Customer from '../models/Customer';
import Product from '../models/Product';
import Service from '../models/Service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalCustomers, totalProducts, totalServices, servicesDueThisMonth] = await Promise.all([
      Customer.countDocuments(),
      Product.countDocuments(),
      Service.countDocuments(),
      Product.countDocuments({ nextServiceDate: { $gte: monthStart, $lte: monthEnd } }),
    ]);

    res.json({ totalCustomers, totalProducts, totalServices, servicesDueThisMonth });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recent-services', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await Service.find()
      .populate('customerId', 'name mobileNumber')
      .populate('productId', 'productName serialNumber')
      .sort({ serviceDate: -1 })
      .limit(10);
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/upcoming-services', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const monthEnd = new Date();
    monthEnd.setDate(monthEnd.getDate() + 30);

    const products = await Product.find({ nextServiceDate: { $lte: monthEnd } })
      .populate('customerId', 'name mobileNumber')
      .sort({ nextServiceDate: 1 })
      .limit(10);
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
