import { Router, Response } from 'express';
import Customer from '../models/Customer';
import Product from '../models/Product';
import Service from '../models/Service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query: Record<string, unknown> = {};
    if (search) {
      const s = String(search);
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { mobileNumber: { $regex: s, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(query),
    ]);
    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) { res.json([]); return; }
    const s = String(q);

    const productBySerial = await Product.findOne({ serialNumber: { $regex: s, $options: 'i' } });
    const customerIds: Set<string> = new Set();

    if (productBySerial) customerIds.add(productBySerial.customerId.toString());

    const customers = await Customer.find({
      $or: [
        { name: { $regex: s, $options: 'i' } },
        { mobileNumber: { $regex: s, $options: 'i' } },
      ],
    }).limit(10);

    customers.forEach(c => customerIds.add(c._id.toString()));

    const allCustomers = await Customer.find({ _id: { $in: Array.from(customerIds) } });
    res.json(allCustomers);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) { res.status(404).json({ message: 'Not found' }); return; }
    const [products, services] = await Promise.all([
      Product.find({ customerId: req.params.id }).sort({ purchaseDate: -1 }),
      Service.find({ customerId: req.params.id }).populate('productId', 'productName serialNumber').sort({ serviceDate: -1 }),
    ]);
    res.json({ customer, products, services });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err: unknown) {
    const e = err as { code?: number };
    res.status(e.code === 11000 ? 400 : 500).json({ message: e.code === 11000 ? 'Duplicate entry' : 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(customer);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
