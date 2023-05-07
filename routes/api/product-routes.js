const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Find all products and include their associated Category and Tag data
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        Category,
        { model: Tag, through: ProductTag, as: "product_tags" },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Find a single product by its `id` and include its associated Category and Tag data
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        Category,
        { model: Tag, through: ProductTag, as: "product_tags" },
      ],
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const productData = {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
    };

    const newProduct = await Product.create(productData);

    // If there are tagIds, create the product-tag relationships
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Respond with the created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});


// update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
    } else {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

      res.status(200).json({ message: "Product updated" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
