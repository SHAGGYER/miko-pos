const { IsUser } = require("../middleware/IsUser");

const { ContactController } = require("../controllers/ContactController");
const router = require("express").Router();

router.get("/", IsUser, ContactController.search);
router.put("/:id", IsUser, ContactController.update);
router.post("/", IsUser, ContactController.create);
router.post("/delete", IsUser, ContactController.delete);

module.exports = router;
