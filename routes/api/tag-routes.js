const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
  
  // find all tags
  // be sure to include its associated Product data
  router.get('/', async (req, res) => {
    try {
      const tagsWithProducts = await Tag.findAll({
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      });
  
      res.json(tagsWithProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  // find a single tag by its `id`
  // be sure to include its associated Product data
  router.get('/:id', async (req, res) => {
    try {
      const tagWithProduct = await Tag.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      });
  
      if (!tagWithProduct) {
        return res.status(404).json({ message: 'No tag found with this id' });
      }
  
      res.json(tagWithProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  // create a new tag
  router.post('/', async (req, res) => {
    try {
      const newTag = await Tag.create({
        tag_name: req.body.tag_name
      });
  
      res.json(newTag);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  // update a tag's name by its `id` value
  router.put('/:id', async (req, res) => {
    try {
      const [rowsUpdated, [updatedTag]] = await Tag.update(req.body, {
        where: {
          id: req.params.id
        },
        returning: true
      });
  
      if (rowsUpdated === 0) {
        return res.status(404).json({ message: 'No tag found with this id' });
      }
  
      res.json(updatedTag);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  // delete on tag by its `id` value
  router.delete('/:id', async (req, res) => {
    try {
      const rowsDeleted = await Tag.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (rowsDeleted === 0) {
        return res.status(404).json({ message: 'No tag found with this id' });
      }
  
      res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

module.exports = router;
