const router = require('express').Router();
const { Category, Product } = require('../../models');
// Find all categories and include their associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: [Product] });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Find one category by its `id` value and include its associated products
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [Product] });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, { where: { id: req.params.id } });
    if (!updatedCategory[0]) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json({ message: 'Category updated' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({ where: { id: req.params.id } });
    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json({ message: 'Category deleted' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
