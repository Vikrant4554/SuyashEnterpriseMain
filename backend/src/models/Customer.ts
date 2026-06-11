import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  mobileNumber: string;
  alternateNumber?: string;
  address: string;
  notes?: string;
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  alternateNumber: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

CustomerSchema.index({ name: 'text', mobileNumber: 1 });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
