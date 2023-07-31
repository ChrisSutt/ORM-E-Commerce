const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
  router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
    try {
      const dbProductData = await Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          },
          {
            model: Tag,
            attributes: ['tag_name']
          }
        ]
      });
  
      res.json(dbProductData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

// get one product
  router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
    try {
      const dbProductData = await Product.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          },
          {
            model: Tag,
            attributes: ['tag_name']
          }
        ]
      });
  
      if (!dbProductData) {
        return res.status(404).json({ message: 'No product found with this id' });
      }
  
      res.json(dbProductData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds
    });
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        return ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
            // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
            // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]).then(() => product); // Return the updated product after both actions are completed
        });
      }

      return product;
    })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.error(err);
      // console.log(err);
      res.status(400).json(err);
    });
});


  router.delete('/:id', async (req, res) => {
    // delete one product by its `id` value
    try {
      const rowsDeleted = await Product.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (rowsDeleted === 0) {
        return res.status(404).json({ message: 'No product found with this id' });
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  

module.exports = router;
