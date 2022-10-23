const Invoice = require("../models/Invoice");
const User = require("../models/User");
const { ValidationService } = require("../services/ValidationService");
const { MailService } = require("../services/MailService");
const { v4 } = require("uuid");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

String.prototype.replaceAll = function (search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

exports.InvoiceController = class {
  static async sendInvoice(req, res) {
    try {
      await MailService.sendMail({
        to: req.body.email,
        html: `You have received a new invoice. Check attachment.`,
        subject: "New Invoice",
        attachments: req.body.attachments,
      });
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  static async generateInvoice(req, res) {
    const user = await User.findById(res.locals.userId).populate("shop");

    const errors = await ValidationService.run(
      {
        contact: [[(val) => !val, "Contact is required"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const invoice = new Invoice({
      lines: req.body.lines,
      total: req.body.total,
      shortId: getRandomArbitrary(1000, 9999999),
      contact: req.body.contact,
      shopId: user.shop._id,
    });
    await invoice.save();

    const template = fs
      .readFileSync(path.join(__dirname, "../data", "invoice.html"))
      .toString();
    let linesHtml = "";

    for (let line of req.body.lines) {
      linesHtml += `
<tr>
    <td width="80%" class="purchase_item">
      <span class="f-fallback">
        ${line.title}
      </span>
    </td>
    <td class="align-right" width="20%" class="purchase_item">
      <span class="f-fallback">
        ${
          line.isDiscount && line.computationStyle === "percentage"
            ? `${line.sell_price}%`
            : line.sell_price.toFixed(2)
        }
      </span>
    </td>
</tr>      
`;
    }

    const html = template
      .replace("%LINES%", linesHtml)
      .replaceAll("%INVOICE_ID%", invoice.shortId)
      .replaceAll("%SHOP_NAME%", user.shop.title)
      .replaceAll("%SHOP_ADDRESS%", user.shop.address?.street)
      .replaceAll("%SHOP_ZIP%", user.shop.address?.zip)
      .replaceAll("%SHOP_CITY%", user.shop.address?.city)
      .replaceAll("%SHOP_COUNTRY%", user.shop.address?.country)
      .replaceAll("%TOTAL%", req.body.total.toFixed(2))
      .replaceAll("%INVOICE_DATE%", moment().format("DD-MM-YYYY"))
      .replaceAll("%DUE_DATE%", moment().add(7, "days").format("DD-MM-YYYY"))
      .replace("%USER_NAME%", req.body.contact.name);

    let options = { format: "A4" };
    let file = { content: html };
    html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
      const fileName = v4() + ".pdf";
      fs.createWriteStream(path.join(__dirname, "../invoices", fileName)).write(
        pdfBuffer
      );

      invoice.fileName = fileName;
      await invoice.save();
      res.sendStatus(200);
    });
  }

  static async get(req, res) {
    const row = await Invoice.findById(req.params.id);
    res.send({ content: row });
  }

  static async update(req, res) {
    await Invoice.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.sendStatus(204);
  }

  static async delete(req, res) {
    for (let id of req.body.ids) {
      await Invoice.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);

    const rows = await Invoice.find({ shopId: user.shop })
      .limit(10)
      .skip(parseInt(req.query.page - 1) * 10);

    const totalRows = await Invoice.find({
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
        lines: [[(val) => !val && !val.length, "Lines are required"]],
        contact: [[(val) => !val, "Contact is required"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const row = new Invoice({ ...req.body, shopId: user.shop });
    await row.save();
    res.send({ content: row });
  }
};
