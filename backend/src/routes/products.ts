import { Router, Response } from 'express';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId, page = 1, limit = 10 } = req.query;
    const query: Record<string, unknown> = {};
    if (customerId) query.customerId = customerId;
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).populate('customerId', 'name mobileNumber').sort({ purchaseDate: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('customerId', 'name mobileNumber address');
    if (!product) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    if (!data.nextServiceDate) {
      data.nextServiceDate = addMonths(new Date(data.purchaseDate), 3);
    }
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
