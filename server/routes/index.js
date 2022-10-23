const express = require("express");
const path = require("path");

const router = express.Router();

router.use("/api", require("./api"));

module.exports = router;
