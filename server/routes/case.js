const { IsUser } = require("../middleware/IsUser");

const { CaseController } = require("../controllers/CaseController");
const router = require("express").Router();

router.get("/", IsUser, CaseController.search);
router.put("/:id", IsUser, CaseController.update);
router.post("/", IsUser, CaseController.create);
router.post("/delete", IsUser, CaseController.delete);

module.exports = router;
