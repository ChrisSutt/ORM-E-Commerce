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
      const existingTag = await Tag.findByPk(req.params.id);
  
      if (!existingTag) {
        return res.status(404).json({ message: 'No tag found with this id' });
      }
  
      console.log('Request Body:', req.body);
  
      const [rowsUpdated] = await Tag.update(
        {
          tag_name: req.body.tag_name,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
  
      console.log('Rows Updated:', rowsUpdated);
  
      if (rowsUpdated === 0) {
        return res.status(500).json({ message: 'Error updating the tag' });
      }
  
      const updatedTag = await Tag.findByPk(req.params.id);
  
      console.log("Updated Tag:", updatedTag);
  
      res.json(updatedTag);
    } catch (err) {
      console.error("Error updating the tag:", err);
      res.status(500).json({ message: 'Error updating the tag', error: err.message });
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
