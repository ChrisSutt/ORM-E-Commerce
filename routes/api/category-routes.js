const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

  router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
    try {
      const categoriesWithProducts = await Category.findAll({
        include: {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      });
    
      if (categoriesWithProducts.length === 0) {
        return res.status(404).json({ message: 'No categories found' });
      }
    
      res.json(categoriesWithProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });


  router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
    try {
      const categoriesWithProducts = await Category.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      });
  
      if (!categoriesWithProducts) {
        return res.status(404).json({ message: 'No categories found' });
      }
  
      res.json(categoriesWithProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

  
  router.post('/', async (req, res) => {
    // create a new category
    try {
      const categoriesWithProducts = await Category.create({
        category_name: req.body.category_name
      });
  
      res.json(categoriesWithProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
