import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import productRouter from './routes/product';
import analyticsRouter from './routes/analytics';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.URL_API_FRONTEND, // Only allow this frontend
  })
);

// Routes
app.use('/products', productRouter);
app.use('/analytics', analyticsRouter);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URL as string)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & listening on port ${process.env.PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error connecting to the database:', err);
  });
