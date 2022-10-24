const Contact = require("../models/Contact");
const Service = require("../models/Service");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { ValidationService } = require("../services/ValidationService");
const validator = require("validator");

exports.ContactController = class {
  static async update(req, res) {
    await Contact.findByIdAndUpdate(req.params.id, {
      $set: { ...req.body },
    });
    res.sendStatus(204);
  }

  static async delete(req, res) {
    for (let id of req.body.ids) {
      await Contact.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);

    let searchQuery = {};

    if (req.query.search) {
      const regexString = new RegExp(req.query.search, "i");

      searchQuery = {
        $or: [{ name: regexString }, { email: regexString }],
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
        {
          deletedAt: undefined,
        },
      ],
    };

    const rows = await Contact.find(query)
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Contact.find(query).countDocuments();

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
        name: [[(val) => !val, "Name is required"]],
        /*       email: [[(val) => !val, "Email is required"]],*/
        /*       "address.street": [[(val) => !val, "Address is required"]],
        "address.zip": [[(val) => !val, "Zip is required"]],
        "address.city": [[(val) => !val, "City is required"]],
        "address.country": [[(val) => !val, "Country is required"]],*/
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const row = new Contact({ ...req.body, shopId: user.shop });
    await row.save();
    res.send({ content: row });
  }
};
