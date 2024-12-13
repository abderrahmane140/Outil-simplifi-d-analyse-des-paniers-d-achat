const Sales = require('../model/salesModel');
const Products = require('../model/productModel'); 

// GET total sales by date 
const getTotalSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure valid date range
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format' });
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

const getSales = async (req,res) => {
  try{
    const response = await Sales.find({});
    res.status(200).json(response)
  }catch(err){
    console.log(err);
  }
}

const getTrendingProducts = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'startDate and endDate are required' });
  }
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  
  try {
    const trendingProducts = await Sales.aggregate([
      // Group by ProductID to calculate total quantity and total sales
      {
        $match: {
          Date: { $gte: start, $lte: end },
        }
      },
      {
        $group: {
          _id: '$ProductID',
          totalQuantity: { $sum: '$Quantity' },
          totalSales: { $sum: '$TotalAmount' },
        },
      },
      // Sort by totalQuantity in descending order
      {
        $sort: { totalQuantity: -1 },
      },
      // Limit to top 3 products
      {
        $limit: 3,
      },
      // Lookup to join with the products collection
      {
        $lookup: {
          from: 'products', // Name of the products collection
          localField: '_id', // ProductID in sales
          foreignField: 'ProductID', // ProductID in products
          as: 'productDetails',
        },
      },
      // Unwind to ensure a single match
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: false,
        },
      },
      // Group again to ensure unique entries (if duplicates persist)
      {
        $group: {
          _id: '$_id',
          totalQuantity: { $first: '$totalQuantity' },
          totalSales: { $first: '$totalSales' },
          productName: { $first: '$productDetails.ProductName' },
        },
      },
      // Project the final fields
      {
        $project: {
          _id: 0, // Exclude _id from output
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





const getCategorySales = async (req, res) => {
  const {startDate, endDate } = req.body;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'startDate and endDate are required' });
  }

  
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure valid date range
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  try {
    console.log("The aggregation starts now", Date());

    // Add match to filter data before performing $lookup
    const categorySales = await Sales.aggregate([
      // Example: Match to filter sales data
      {
        $match: {
          Date: { $gte: start, $lte: end },
        },
      },

      // Lookup to join sales with products collection
      {
        $lookup: {
          from: 'products',
          localField: 'ProductID',
          foreignField: 'ProductID',
          as: 'productDetails',
        },
      },

      // Add fields for product details (use addFields instead of unwind if possible)
      {
        $addFields: {
          productDetails: { $arrayElemAt: ["$productDetails", 0] }, // Avoid unwind
        },
      },

      // Group by category and calculate total sales and quantity
      {
        $group: {
          _id: '$productDetails.Category',
          totalSales: { $sum: '$TotalAmount' },
          totalQuantity: { $sum: '$Quantity' },
          count: { $sum: 1 },
        },
      },

      // Calculate total sales overall for percentage calculation
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

      // Unwind categories and calculate percentage
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

      // Sort categories by total sales in descending order
      {
        $sort: { totalSales: -1 },
      },
    ]);

    console.log("The aggregation ends now", Date());
    res.status(200).json({ categorySales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};






module.exports = {getTotalSales, getSales, getTrendingProducts, getCategorySales} ;
