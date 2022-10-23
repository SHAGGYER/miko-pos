const Storage = require("../models/Storage");
const User = require("../models/User");
const { ValidationService } = require("../services/ValidationService");

exports.StorageController = class {
  static async update(req, res) {
    await Storage.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.sendStatus(204);
  }

  static async delete(req, res) {
    for (let id of req.body.ids) {
      await Storage.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);

    const searchQuery = {};
    if (req.query.search) {
      searchQuery.$or = [
        {
          title: new RegExp(req.query.search, "i"),
        },
      ];
    }

    const rows = await Storage.find({ ...searchQuery, shopId: user.shop })
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Storage.find({
      ...searchQuery,
      shopId: user.shop,
    }).countDocuments();

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
        title: [[(val) => !val, "Title required"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const row = new Storage({ ...req.body, shopId: user.shop });
    await row.save();
    res.send({ content: row });
  }
};
