const Product = require("../models/Product");
const Service = require("../models/Service");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const { ValidationService } = require("../services/ValidationService");

function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

exports.ProductController = class {
  static async getRandomSku(req, res) {
    const user = await User.findById(res.locals.userId).populate("shop");
    const randomSku = getRandomArbitrary(parseInt(user.shop.startSku), 999999);
    res.send({ content: randomSku });
  }

  static async update(req, res) {
    await Product.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.sendStatus(204);
  }

  static async deleteProducts(req, res) {
    for (let id of req.body.ids) {
      await Product.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);

    let searchQuery = {};

    if (req.query.search) {
      const regexString = new RegExp(req.query.search, "i");

      searchQuery = {
        $or: [{ title: regexString }, { sku: regexString }],
      };
    }

    const query = {
      $and: [
        {
          ...searchQuery,
        },
        {
          shopId: user.shop,
        },
      ],
    };

    const products = await Product.find(query)
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Product.find(query).countDocuments();

    res.send({
      content: products,
      totalRows,
      page: parseInt(req.query.page),
      search: req.query.search,
    });
  }

  static async create(req, res) {
    const user = await User.findById(res.locals.userId);

    const errors = await ValidationService.run(
      {
        title: [[(val) => !val, "Title is required"]],
        buy_price: [[(val) => !val, "Buy Price is required"]],
        sell_price: [[(val) => !val, "Sell Price is required"]],
        quantity: [[(val) => !val, "Quantity is required"]],
        sku: [
          [(val) => !val, "SKU is required"],
          [
            async (val) => {
              const productExists = await Product.findOne({
                shopId: user.shop,
                sku: val,
              });

              const serviceExists = await Service.findOne({
                shopId: user.shop,
                sku: val,
              });
              return !!productExists || !!serviceExists;
            },
            "SKU is taken",
          ],
        ],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const product = new Product({ ...req.body, shopId: user.shop });
    await product.save();
    res.send({ content: product });
  }
};
