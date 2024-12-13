const Product = require('../model/productModel');
const Sales = require('../model/salesModel');

const getProductsWithSales = async (req, res) => {
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
    // Step 1: Filter sales upfront
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

    // Step 2: Map sales data for quick access
    const salesMap = salesData.reduce((acc, sale) => {
      acc[sale._id] = sale.totalQuantity;
      return acc;
    }, {});

    // Step 3: Fetch products and append sales data
    const products = await Product.find({}).limit(20).lean();

    const productsWithSales = products.map((product) => ({
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      Category: product.Category,
      Price: product.Price,
      totalQuantity: salesMap[product.ProductID] || 0, // Default to 0 if no sales
    }));

    res.status(200).json(productsWithSales);
  } catch (err) {
    console.error('Error retrieving products with sales:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = getProductsWithSales;
