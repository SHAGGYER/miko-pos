const Case = require("../models/Case");
const User = require("../models/User");
const { ValidationService } = require("../services/ValidationService");
const shortid = require("shortid");

exports.CaseController = class {
  static async update(req, res) {
    await Case.findByIdAndUpdate(req.params.id, { $set: req.body });
    const dbCase = await Case.findById(req.params.id);
    res.send({ content: dbCase });
  }

  static async delete(req, res) {
    for (let id of req.body.ids) {
      await Case.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);

    let searchQuery = {};

    if (req.query.search) {
      const regexString = new RegExp(req.query.search, "i");

      searchQuery = {
        $or: [{ shortId: regexString }],
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
          deletedAt: {
            $eq: undefined,
          },
        },
      ],
    };

    const rows = await Case.find(query)
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Case.find(query).countDocuments();

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
        lines: [[(val) => !val, "Lines are required"]],
        contact: [[(val) => !val, "Contact is required"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const row = new Case({
      ...req.body,
      shortId: shortid.generate(),
      shopId: user.shop,
    });
    await row.save();
    res.send({ content: row });
  }
};
