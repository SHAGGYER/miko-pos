const Service = require("../models/Service");
const ServiceProduct = require("../models/ServiceProduct");
const Product = require("../models/Product");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { ValidationService } = require("../services/ValidationService");

exports.ServiceController = class {
  static async update(req, res) {
    let serviceProductIds = [];
    for (let serviceProduct of req.body.serviceProducts) {
      if (serviceProduct._id) {
        await ServiceProduct.findByIdAndUpdate(serviceProduct._id, {
          $set: serviceProduct,
        });
        serviceProductIds.push(serviceProduct._id);
      } else {
        const dbServiceProduct = new ServiceProduct({
          ...serviceProduct,
          product: serviceProduct.product._id,
        });
        await dbServiceProduct.save();
        serviceProductIds.push(dbServiceProduct._id);
      }
    }

    await Service.findByIdAndUpdate(req.params.id, {
      $set: { ...req.body, serviceProducts: serviceProductIds },
    });
    res.sendStatus(204);
  }

  static async delete(req, res) {
    for (let id of req.body.ids) {
      await Service.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
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

    const rows = await Service.find(query)
      .populate({
        path: "serviceProducts",
        populate: {
          path: "product",
        },
      })
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Service.find(query).countDocuments();

    res.send({
      content: rows,
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
        sell_price: [[(val) => !val, "Sell Price is required"]],
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

    const serviceProductIds = [];
    for (let serviceProduct of req.body.serviceProducts) {
      const dbServiceProduct = new ServiceProduct({
        ...serviceProduct,
        product: serviceProduct.product._id,
      });
      await dbServiceProduct.save();
      serviceProductIds.push(dbServiceProduct._id);
    }

    const service = new Service({
      ...req.body,
      shopId: user.shop,
      serviceProducts: serviceProductIds,
    });
    await service.save();

    res.send({ content: service });
  }
};
