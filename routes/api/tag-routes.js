const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Find all tags and include their associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: [{ model: Product, through: ProductTag, as: 'tag_products' }] });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Find a single tag by its `id` and include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { include: [{ model: Product, through: ProductTag, as: 'tag_products' }] });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      res.status(200).json(tag);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, { where: { id: req.params.id } });
    if (!updatedTag[0]) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      res.status(200).json({ message: 'Tag updated' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({ where: { id: req.params.id } });
    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      res.status(200).json({ message: 'Tag deleted' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
