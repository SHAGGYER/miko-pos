const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/products", require("./product"));
router.use("/services", require("./service"));
router.use("/contacts", require("./contact"));
router.use("/invoices", require("./invoice"));

module.exports = router;
