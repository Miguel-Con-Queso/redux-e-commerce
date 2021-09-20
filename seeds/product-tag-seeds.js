const { ProductTag } = require("../models");

const productTagData = [
  {
    productID: 1,
    tagID: 6,
  },
  {
    productID: 1,
    tagID: 7,
  },
  {
    productID: 1,
    tagID: 8,
  },
  {
    productID: 2,
    tagID: 6,
  },
  {
    productID: 3,
    tagID: 1,
  },
  {
    productID: 3,
    tagID: 3,
  },
  {
    productID: 3,
    tagID: 4,
  },
  {
    productID: 3,
    tagID: 5,
  },
  {
    productID: 4,
    tagID: 1,
  },
  {
    productID: 4,
    tagID: 2,
  },
  {
    productID: 4,
    tagID: 8,
  },
  {
    productID: 5,
    tagID: 3,
  },
];

const seedProductTags = () => ProductTag.bulkCreate(productTagData);

module.exports = seedProductTags;
