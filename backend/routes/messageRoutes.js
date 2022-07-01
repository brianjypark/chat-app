const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(checkAuth, sendMessage);
router.route("/:chatId").get(checkAuth, allMessages);

module.exports = router;
