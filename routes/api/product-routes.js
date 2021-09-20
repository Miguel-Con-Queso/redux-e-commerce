const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  Product.findAll({
    attributes: ["id", "productName", "price", "stock", "categoryID"],
    include: [
      {
        model: Category,
        attributes: ["id", "categoryName"],
      },
      {
        model: Tag,
        attributes: ["id", "tagName"],
      },
    ],
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  Product.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "productName", "price", "stock", "categoryID"],
    include: [
      {
        model: Category,
        attributes: ["id", "categoryName"],
      },
      {
        model: Tag,
        attributes: ["id", "tagName"],
      },
    ],
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: "No product found with this id" });
        return;
      }
      res.json(dbProductData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIDs.length) {
        const productTagIDArr = req.body.tagIDs.map((tagID) => {
          return {
            productID: product.id,
            tagID,
          };
        });
        return ProductTag.bulkCreate(productTagIDArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { productID: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tagIDs
      const productTagIds = productTags.map(({ tagID }) => tagID);
      // create filtered list of new tagIDs
      const newProductTags = req.body.tagIds
        .filter((tagID) => !productTagIds.includes(tagID))
        .map((tagID) => {
          return {
            productID: req.params.id,
            tagID,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tagID }) => !req.body.tagIds.includes(tagID))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: "No product found with this id" });
        return;
      }
      res.json(dbProductData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
