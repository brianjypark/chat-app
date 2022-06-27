const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(checkAuth, allUsers);
router.post("/login", authUser);

module.exports = router;
