import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { useState } from 'react';

interface Customer { _id: string; name: string; mobileNumber: string; alternateNumber?: string; address: string; notes?: string; }
interface Props { open: boolean; customer: Customer | null; onClose: () => void; onSaved: () => void; }
interface FormData { name: string; mobileNumber: string; alternateNumber: string; address: string; notes: string; }

export default function CustomerForm({ open, customer, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (open) reset({
      name: customer?.name || '',
      mobileNumber: customer?.mobileNumber || '',
      alternateNumber: customer?.alternateNumber || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
    });
  }, [open, customer, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (customer) await api.put(`/customers/${customer._id}`, data);
      else await api.post('/customers', data);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField fullWidth label="Name *" {...register('name', { required: 'Required' })} error={!!errors.name} helperText={errors.name?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Mobile Number *" {...register('mobileNumber', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10 digits required' } })} error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Alternate Number" {...register('alternateNumber')} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Address *" multiline rows={2} {...register('address', { required: 'Required' })} error={!!errors.address} helperText={errors.address?.message} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Notes" multiline rows={2} {...register('notes')} />
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
