import { Request, Response } from 'express';
import Sales from '../model/salesModel';
import Products from '../model/productModel';

// GET total sales by date
const getTotalSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json({ message: 'startDate and endDate are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure valid date range
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    // Aggregate the total sales amount for the given period
    const result = await Sales.aggregate([
      {
        $match: {
          Date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$TotalAmount' },
        },
      },
    ]);

    // Check if results are available
    const totalSales = result.length > 0 ? result[0].totalSales : 0;

    res.status(200).json({ totalSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sales
const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await Sales.find({});
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error retrieving sales' });
  }
};

// Get trending products
const getTrendingProducts = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.body;

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
    const trendingProducts = await Sales.aggregate([
      {
        $match: {
          Date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$ProductID',
          totalQuantity: { $sum: '$Quantity' },
          totalSales: { $sum: '$TotalAmount' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'ProductID',
          as: 'productDetails',
        },
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: '$_id',
          totalQuantity: { $first: '$totalQuantity' },
          totalSales: { $first: '$totalSales' },
          productName: { $first: '$productDetails.ProductName' },
        },
      },
      {
        $project: {
          _id: 0,
          productName: 1,
          totalQuantity: 1,
          totalSales: 1,
        },
      },
    ]);

    res.status(200).json({ trendingProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sales by category
const getCategorySales = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.body;

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
    console.log('The aggregation starts now', Date());

    const categorySales = await Sales.aggregate([
      {
        $match: {
          Date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'ProductID',
          foreignField: 'ProductID',
          as: 'productDetails',
        },
      },
      {
        $addFields: {
          productDetails: { $arrayElemAt: ['$productDetails', 0] },
        },
      },
      {
        $group: {
          _id: '$productDetails.Category',
          totalSales: { $sum: '$TotalAmount' },
          totalQuantity: { $sum: '$Quantity' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          categories: {
            $push: {
              category: '$_id',
              totalSales: '$totalSales',
              totalQuantity: '$totalQuantity',
              count: '$count',
            },
          },
          totalSalesOverall: { $sum: '$totalSales' },
        },
      },
      {
        $unwind: '$categories',
      },
      {
        $project: {
          _id: 0,
          category: '$categories.category',
          totalSales: '$categories.totalSales',
          totalQuantity: '$categories.totalQuantity',
          count: '$categories.count',
          percentage: {
            $multiply: [
              { $divide: ['$categories.totalSales', '$totalSalesOverall'] },
              100,
            ],
          },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
    ]);

    console.log('The aggregation ends now', Date());
    res.status(200).json({ categorySales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getTotalSales, getSales, getTrendingProducts, getCategorySales };
