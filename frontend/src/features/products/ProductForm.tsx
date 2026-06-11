import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

interface Product { _id: string; productName: string; category: string; brand: string; model: string; serialNumber: string; purchaseDate: string; salePrice: number; nextServiceDate: string; }
interface Props { open: boolean; customerId: string; product: Product | null; onClose: () => void; onSaved: () => void; }
interface FormData { productName: string; category: string; brand: string; model: string; serialNumber: string; purchaseDate: string; salePrice: string; nextServiceDate: string; }

const CATEGORIES = ['Water Purifier', 'Atta Chakki', 'Other'];

export default function ProductForm({ open, customerId, product, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
  const purchaseDate = watch('purchaseDate');

  useEffect(() => {
    if (open) {
      const defaultNextService = product?.nextServiceDate
        ? product.nextServiceDate.split('T')[0]
        : purchaseDate ? (() => { const d = new Date(purchaseDate); d.setMonth(d.getMonth() + 3); return d.toISOString().split('T')[0]; })() : '';
      reset({
        productName: product?.productName || '',
        category: product?.category || 'Water Purifier',
        brand: product?.brand || '',
        model: product?.model || '',
        serialNumber: product?.serialNumber || '',
        purchaseDate: product?.purchaseDate ? product.purchaseDate.split('T')[0] : '',
        salePrice: product?.salePrice?.toString() || '',
        nextServiceDate: defaultNextService,
      });
    }
  }, [open, product, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, customerId, salePrice: Number(data.salePrice) };
      if (product) await api.put(`/products/${product._id}`, payload);
      else await api.post('/products', payload);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product Sale'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField fullWidth label="Product Name *" {...register('productName', { required: 'Required' })} error={!!errors.productName} helperText={errors.productName?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth select label="Category *" defaultValue="Water Purifier" {...register('category', { required: 'Required' })}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Brand *" {...register('brand', { required: 'Required' })} error={!!errors.brand} helperText={errors.brand?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Model *" {...register('model', { required: 'Required' })} error={!!errors.model} helperText={errors.model?.message} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Serial Number *" {...register('serialNumber', { required: 'Required' })} error={!!errors.serialNumber} helperText={errors.serialNumber?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Purchase Date *" type="date" InputLabelProps={{ shrink: true }} {...register('purchaseDate', { required: 'Required' })} error={!!errors.purchaseDate} helperText={errors.purchaseDate?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Sale Price (₹) *" type="number" {...register('salePrice', { required: 'Required', min: { value: 0, message: 'Must be >= 0' } })} error={!!errors.salePrice} helperText={errors.salePrice?.message} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Next Service Date *" type="date" InputLabelProps={{ shrink: true }} {...register('nextServiceDate', { required: 'Required' })} error={!!errors.nextServiceDate} helperText={errors.nextServiceDate?.message} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
