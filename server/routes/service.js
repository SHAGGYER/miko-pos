const { IsUser } = require("../middleware/IsUser");

const { ServiceController } = require("../controllers/ServiceController");
const router = require("express").Router();

router.get("/", IsUser, ServiceController.search);
router.put("/:id", IsUser, ServiceController.update);
router.post("/", IsUser, ServiceController.create);
router.post("/delete", IsUser, ServiceController.delete);

module.exports = router;
