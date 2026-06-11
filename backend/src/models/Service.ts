import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  serviceDate: Date;
  problemDescription: string;
  workDone: string;
  partsReplaced: string;
  serviceCharge: number;
  nextServiceDate: Date;
}

const ServiceSchema = new Schema<IService>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  serviceDate: { type: Date, required: true },
  problemDescription: { type: String, trim: true },
  workDone: { type: String, trim: true },
  partsReplaced: { type: String, trim: true },
  serviceCharge: { type: Number, default: 0 },
  nextServiceDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
