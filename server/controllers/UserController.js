const User = require("../models/User");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const { ValidationService } = require("../services/ValidationService");

exports.UserController = class {
  static async createShop(req, res) {
    const user = await User.findById(res.locals.userId);

    const errors = await ValidationService.run(
      {
        title: [[(val) => !val, "Title is required"]],
        "address.street": [[(val) => !val, "Address is required"]],
        "address.zip": [[(val) => !val, "Zip is required"]],
        "address.city": [[(val) => !val, "City is required"]],
        "address.country": [[(val) => !val, "Country is required"]],
        startSku: [[(val) => !val, "Start SKU is required"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const shop = new Shop({
      title: req.body.title,
      userId: user._id,
      startSku: req.body.startSku,
      address: req.body.address,
    });
    await shop.save();
    user.shop = shop._id;
    await user.save();

    const products = [
      {
        title: "Work 30 mins",
        sell_price: 150,
        type: "abstract",
        quantity: undefined,
        sku: "default",
      },
    ];

    for (let product of products) {
      const dbProduct = new Product({ ...product, shopId: shop._id });
      await dbProduct.save();
    }

    res.send({ content: { shop, user } });
  }

  static async changePassword(req, res) {
    const user = await User.findById(res.locals.userId);

    const errors = await ValidationService.checkNewPassword(user, req.body);
    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.sendStatus(204);
  }

  static async create(req, res) {
    const errors = await ValidationService.checkUser(req.body);
    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const user = new User({
      ...req.body,
      tempPassword: req.body.password,
    });
    await user.save();
    res.send({ user });
  }

  static saveUserDetails = async (req, res) => {
    try {
      await User.findByIdAndUpdate(res.locals.userId, { $set: req.body });
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  static async adminDeleteUsers(req, res) {
    for (let id of req.body.ids) {
      const user = await User.findById(id);
      if (!user) {
        return res.sendStatus(500);
      }

      const shop = await Shop.findOne({ userId: id });
      await shop.remove();

      await user.remove();
    }

    return res.sendStatus(204);
  }

  static async adminGetUsers(req, res) {
    const perPage = parseInt(req.query.per_page);
    const page = parseInt(req.query.page);

    let searchQuery = {};

    if (req.query.search) {
      const regexString = new RegExp(req.query.search, "i");

      searchQuery = {
        $or: [{ email: regexString }, { name: regexString }],
      };
    }

    const users = await User.find(searchQuery)
      .limit(perPage)
      .skip((page - 1) * perPage);

    const total = await User.find(searchQuery).countDocuments();
    return res.send({ users, total: total });
  }

  static removeAccount = async (req, res) => {
    const user = await User.findById(res.locals.userId);

    //TODO: remove shop

    await user.remove();

    res.sendStatus(204);
  };
};
