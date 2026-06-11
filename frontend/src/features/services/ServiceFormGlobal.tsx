import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
  CircularProgress, MenuItem, Autocomplete,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

interface CustomerOption { _id: string; name: string; mobileNumber: string; }
interface ProductOption { _id: string; productName: string; serialNumber: string; }
interface Service {
  _id: string; customerId: string | { _id: string }; productId: string | { _id: string };
  serviceDate: string; problemDescription: string; workDone: string;
  partsReplaced: string; serviceCharge: number; nextServiceDate: string;
}
interface Props { open: boolean; service: Service | null; onClose: () => void; onSaved: () => void; }
interface FormData { serviceDate: string; problemDescription: string; workDone: string; partsReplaced: string; serviceCharge: string; nextServiceDate: string; }

export default function ServiceFormGlobal({ open, service, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<FormData>();
  const serviceDate = watch('serviceDate');

  useEffect(() => {
    if (!open) return;
    const today = new Date().toISOString().split('T')[0];
    const nextDue = (() => { const d = new Date(today); d.setMonth(d.getMonth() + 3); return d.toISOString().split('T')[0]; })();
    reset({ serviceDate: today, problemDescription: '', workDone: '', partsReplaced: '', serviceCharge: '0', nextServiceDate: nextDue });
    setSelectedCustomer(null); setSelectedProduct(null);
  }, [open, reset]);

  useEffect(() => {
    if (customerSearch.length < 1) return;
    const t = setTimeout(async () => {
      const res = await api.get('/customers', { params: { search: customerSearch, limit: 20 } });
      setCustomers(res.data.customers);
    }, 300);
    return () => clearTimeout(t);
  }, [customerSearch]);

  useEffect(() => {
    if (!selectedCustomer) { setProducts([]); setSelectedProduct(null); return; }
    api.get('/products', { params: { customerId: selectedCustomer._id, limit: 50 } }).then(res => {
      setProducts(res.data.products);
      if (res.data.products.length > 0) setSelectedProduct(res.data.products[0]);
    });
  }, [selectedCustomer]);

  useEffect(() => {
    if (serviceDate) {
      const d = new Date(serviceDate); d.setMonth(d.getMonth() + 3);
      setValue('nextServiceDate', d.toISOString().split('T')[0]);
    }
  }, [serviceDate, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!selectedCustomer || !selectedProduct) return;
    setLoading(true);
    try {
      const payload = { ...data, customerId: selectedCustomer._id, productId: selectedProduct._id, serviceCharge: Number(data.serviceCharge) };
      if (service) await api.put(`/services/${service._id}`, payload);
      else await api.post('/services', payload);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{service ? 'Edit Service' : 'Add Service Record'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Autocomplete
                options={customers}
                getOptionLabel={o => `${o.name} (${o.mobileNumber})`}
                value={selectedCustomer}
                onChange={(_, v) => setSelectedCustomer(v)}
                onInputChange={(_, v) => setCustomerSearch(v)}
                renderInput={params => <TextField {...params} label="Customer *" required />}
              />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth select label="Product *" value={selectedProduct?._id || ''} onChange={e => setSelectedProduct(products.find(p => p._id === e.target.value) || null)} disabled={products.length === 0}>
                {products.map(p => <MenuItem key={p._id} value={p._id}>{p.productName} ({p.serialNumber})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Service Date *" type="date" InputLabelProps={{ shrink: true }} {...register('serviceDate', { required: 'Required' })} error={!!errors.serviceDate} helperText={errors.serviceDate?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Service Charge (₹)" type="number" {...register('serviceCharge')} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Problem Description" multiline rows={2} {...register('problemDescription')} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Work Done" multiline rows={2} {...register('workDone')} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Parts Replaced" {...register('partsReplaced')} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Next Service Date *" type="date" InputLabelProps={{ shrink: true }} {...register('nextServiceDate', { required: 'Required' })} error={!!errors.nextServiceDate} helperText={errors.nextServiceDate?.message} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || !selectedCustomer || !selectedProduct}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
