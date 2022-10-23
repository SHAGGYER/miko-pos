const { IsUser } = require("../middleware/IsUser");

const { StorageController } = require("../controllers/StorageController");
const router = require("express").Router();

router.get("/", IsUser, StorageController.search);
router.put("/:id", IsUser, StorageController.update);
router.post("/", IsUser, StorageController.create);
router.post("/delete", IsUser, StorageController.delete);

module.exports = router;
