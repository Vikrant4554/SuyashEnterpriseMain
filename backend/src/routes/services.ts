import { Router, Response } from 'express';
import Service from '../models/Service';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId, productId, page = 1, limit = 10 } = req.query;
    const query: Record<string, unknown> = {};
    if (customerId) query.customerId = customerId;
    if (productId) query.productId = productId;
    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('customerId', 'name mobileNumber')
        .populate('productId', 'productName serialNumber')
        .sort({ serviceDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);
    res.json({ services, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/due', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filter } = req.query;
    const now = new Date();
    let end: Date;

    if (filter === 'today') {
      end = new Date(now); end.setHours(23, 59, 59, 999);
    } else if (filter === 'week') {
      end = new Date(now); end.setDate(now.getDate() + 7);
    } else {
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const products = await Product.find({ nextServiceDate: { $lte: end } })
      .populate('customerId', 'name mobileNumber address')
      .sort({ nextServiceDate: 1 });

    res.json(products);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('customerId', 'name mobileNumber address')
      .populate('productId', 'productName serialNumber brand model');
    if (!service) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(service);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    await Product.findByIdAndUpdate(req.body.productId, { nextServiceDate: req.body.nextServiceDate });
    res.status(201).json(service);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) { res.status(404).json({ message: 'Not found' }); return; }
    if (req.body.nextServiceDate) {
      await Product.findByIdAndUpdate(service.productId, { nextServiceDate: req.body.nextServiceDate });
    }
    res.json(service);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
