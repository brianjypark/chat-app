const express = require("express");
const { checkAuth } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(checkAuth, accessChat);
router.route("/").get(checkAuth, fetchChats);

router.route("/group").post(checkAuth, createGroupChat);
router.route("/rename").put(checkAuth, renameGroupChat);

router.route("/groupadd").put(checkAuth, addToGroup);
router.route("/groupremove").put(checkAuth, removeFromGroup);

module.exports = router;
