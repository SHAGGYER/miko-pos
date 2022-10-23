const { IsUser } = require("../middleware/IsUser");

const { ProductController } = require("../controllers/ProductController");
const router = require("express").Router();

router.get("/random-sku", IsUser, ProductController.getRandomSku);
router.get("/", IsUser, ProductController.search);
router.put("/:id", IsUser, ProductController.update);
router.post("/", IsUser, ProductController.create);
router.post("/delete", IsUser, ProductController.deleteProducts);

module.exports = router;
