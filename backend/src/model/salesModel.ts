import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Sales data structure
export interface ISales extends Document {
  SaleID: number;
  ProductID: number;
  Quantity: number;
  Date: Date;
  TotalAmount: number;
}

// Define the schema for the Sales
const salesSchema: Schema<ISales> = new Schema({
  SaleID: {
    type: Number,
    required: true,
  },
  ProductID: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  TotalAmount: {
    type: Number,
    required: true,
  },
});

// Create the model for Sales
const Sales = mongoose.model<ISales>('Sales', salesSchema);

export default Sales;
