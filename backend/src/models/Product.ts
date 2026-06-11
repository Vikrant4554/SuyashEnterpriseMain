import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  productName: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  serialNumber: { type: String, required: true, trim: true },
  purchaseDate: { type: Date, required: true },
  salePrice: { type: Number, required: true },
  nextServiceDate: { type: Date, required: true },
}, { timestamps: true });

ProductSchema.index({ serialNumber: 1 });

export default mongoose.model('Product', ProductSchema);
