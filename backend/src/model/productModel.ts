import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Product data structure
export interface IProduct extends Document {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
}

// Define the schema for the Product
const productSchema: Schema<IProduct> = new Schema({
  ProductID: {
    type: Number,
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});

// Create the model for Product
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
