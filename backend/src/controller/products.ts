import { Request, Response } from 'express';
import Product from '../model/productModel';
import Sales from '../model/salesModel';

// Define types for the response format
interface ProductWithSales {
  ProductID: string;
  ProductName: string;
  Category: string;
  Price: number;
  totalQuantity: number;
}

// Function to get products with sales data between given dates
const getProductsWithSales = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.body;

  // Validate date input
  if (!startDate || !endDate) {
    res.status(400).json({ message: 'startDate and endDate are required' });
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }

  try {
    // Aggregate sales data to calculate total quantity sold per product in the date range
    const salesData = await Sales.aggregate([
      {
        $match: {
          Date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$ProductID',
          totalQuantity: { $sum: '$Quantity' },
        },
      },
    ]);

    // Map sales data for easy lookup based on ProductID
    const salesMap: Record<string, number> = salesData.reduce((acc: Record<string, number>, sale: { _id: number; totalQuantity: number }) => {
      acc[sale._id.toString()] = sale.totalQuantity;  // Convert _id to string
      return acc;
    }, {});

    // Fetch product details from the Product collection
    const products = await Product.find({}).limit(20).lean();

    // Combine product data with sales data
    const productsWithSales: ProductWithSales[] = products.map((product) => ({
      ProductID: product.ProductID.toString(), // Convert ProductID to string
      ProductName: product.ProductName,
      Category: product.Category,
      Price: product.Price,
      totalQuantity: salesMap[product.ProductID.toString()] || 0, // Default to 0 if no sales
    }));

    res.status(200).json(productsWithSales); // Send response with product sales data
  } catch (err) {
    console.error('Error retrieving products with sales:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getProductsWithSales };
