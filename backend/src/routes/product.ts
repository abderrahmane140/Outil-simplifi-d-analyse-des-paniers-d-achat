import express, { Request, Response } from 'express';
import { getProductsWithSales } from '../controller/products';  

const router = express.Router();

// Route to get products with sales data
router.post('/', getProductsWithSales);

export default router;
