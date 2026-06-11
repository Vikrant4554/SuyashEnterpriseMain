import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

interface Product { _id: string; productName: string; serialNumber: string; }
interface Service { _id: string; customerId: string; productId: string; serviceDate: string; problemDescription: string; workDone: string; partsReplaced: string; serviceCharge: number; nextServiceDate: string; }
interface Props { open: boolean; customerId: string; products: Product[]; service: Service | null; onClose: () => void; onSaved: () => void; }
interface FormData { customerId: string; productId: string; serviceDate: string; problemDescription: string; workDone: string; partsReplaced: string; serviceCharge: string; nextServiceDate: string; }

export default function ServiceForm({ open, customerId, products, service, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>();
  const serviceDate = watch('serviceDate');

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];
      const nextDue = service?.nextServiceDate
        ? service.nextServiceDate.split('T')[0]
        : (() => { const d = new Date(today); d.setMonth(d.getMonth() + 3); return d.toISOString().split('T')[0]; })();
      reset({
        customerId,
        productId: service?.productId || (products[0]?._id || ''),
        serviceDate: service?.serviceDate ? service.serviceDate.split('T')[0] : today,
        problemDescription: service?.problemDescription || '',
        workDone: service?.workDone || '',
        partsReplaced: service?.partsReplaced || '',
        serviceCharge: service?.serviceCharge?.toString() || '0',
        nextServiceDate: nextDue,
      });
    }
  }, [open, service, customerId, products, reset]);

  useEffect(() => {
    if (serviceDate && !service) {
      const d = new Date(serviceDate); d.setMonth(d.getMonth() + 3);
      setValue('nextServiceDate', d.toISOString().split('T')[0]);
    }
  }, [serviceDate, service, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, serviceCharge: Number(data.serviceCharge) };
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
              <TextField fullWidth select label="Product *" defaultValue={products[0]?._id || ''} {...register('productId', { required: 'Required' })} error={!!errors.productId} helperText={errors.productId?.message}>
                {products.map(p => <MenuItem key={p._id} value={p._id}>{p.productName} ({p.serialNumber})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Service Date *" type="date" InputLabelProps={{ shrink: true }} {...register('serviceDate', { required: 'Required' })} error={!!errors.serviceDate} helperText={errors.serviceDate?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Service Charge (₹)" type="number" {...register('serviceCharge', { min: { value: 0, message: 'Must be >= 0' } })} />
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
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
