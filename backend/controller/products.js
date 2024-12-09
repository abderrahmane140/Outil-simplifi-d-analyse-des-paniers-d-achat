const Product = require('../model/productModel');
const Sales = require('../model/salesModel');

// Récupérer les produits avec leur nombre de ventes
const getProductsWithSales = async (req, res) => {
  try {
    const productsWithSales = await Product.aggregate([
      {
        $lookup: {
          from: 'sales', // Collection des ventes (nom en minuscules et au pluriel par convention MongoDB)
          localField: 'ProductID',
          foreignField: 'ProductID',
          as: 'salesData',
        },
      },
      {
        $limit: 20
      },
      {
        $addFields: {
          totalQuantity: { $sum: '$salesData.Quantity' },
        },
      },
      {
        $project: {
          ProductID: 1,
          ProductName: 1,
          Category: 1,
          Price: 1,
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json(productsWithSales);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits avec ventes:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = getProductsWithSales;
