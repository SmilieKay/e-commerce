// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
});

Product.belongsToMany(Tag, {
  through: ProductTag,
  as: 'product_tags',
  foreignKey: 'product_id',
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  as: 'tag_products',
  foreignKey: 'tag_id',
});

module.exports = {
  Category,
  Product,
  Tag,
  ProductTag,
};

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
