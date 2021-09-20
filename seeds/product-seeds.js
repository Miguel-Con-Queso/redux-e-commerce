const { Product } = require("../models");

const productData = [
  {
    productName: "Plain T-Shirt",
    price: 14.99,
    stock: 14,
    categoryID: 1,
  },
  {
    productName: "Running Sneakers",
    price: 90.0,
    stock: 25,
    categoryID: 5,
  },
  {
    productName: "Branded Baseball Hat",
    price: 22.99,
    stock: 12,
    categoryID: 4,
  },
  {
    productName: "Top 40 Music Compilation Vinyl Record",
    price: 12.99,
    stock: 50,
    categoryID: 3,
  },
  {
    productName: "Cargo Shorts",
    price: 29.99,
    stock: 22,
    categoryID: 2,
  },
];

const seedProducts = () => Product.bulkCreate(productData);

module.exports = seedProducts;
