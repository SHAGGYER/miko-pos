const { IsUser } = require("../middleware/IsUser");

const { InvoiceController } = require("../controllers/InvoiceController");
const router = require("express").Router();

router.post("/send-invoice", IsUser, InvoiceController.sendInvoice);
router.post("/generate-invoice", IsUser, InvoiceController.generateInvoice);
router.get("/", IsUser, InvoiceController.search);
router.put("/:id", IsUser, InvoiceController.update);
router.post("/", IsUser, InvoiceController.create);
router.post("/delete", IsUser, InvoiceController.delete);

module.exports = router;
