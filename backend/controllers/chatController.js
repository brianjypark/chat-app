const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    console.log("userid param missing.");
    response.sendStatus(400);
  }

  var chatExists = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: request.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("recentMessage");

  chatExists = await User.populate(chatExists, {
    path: "recentMessage.sender",
    select: "name picture email",
  });

  if (chatExists.length > 0) {
    response.send(chatExists[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [request.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      response.status(200).send(FullChat);
    } catch (error) {
      response.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (request, response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: request.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("recentMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "recentMessage.sender",
          select: "name picture email",
        });

        response.status(200).send(results);
      });
  } catch (error) {
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (request, response) => {
  if (!request.body.users || !request.body.name) {
    return response
      .status(400)
      .send({ message: "Please fill all the fields." });
  }

  let users = JSON.parse(request.body.users);

  if (users.length < 2) {
    return response
      .status(400)
      .send("To create a group chat, please add more users.");
  }

  users.push(request.user);

  try {
    const groupChat = await Chat.create({
      chatName: request.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: request.user,
    });

    const fetchGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    response.status(200).json(fetchGroupChat);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (request, response) => {
  const { chatId, chatName } = request.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    response.status(404);
    throw new Error("Chat not found");
  } else {
    response.json(updateChat);
  }
});

const addToGroup = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;

  const addUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUser) {
    response.status(404);
    throw new Error("Chat not found");
  } else {
    response.json(addUser);
  }
});

const removeFromGroup = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;

  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser) {
    response.status(404);
    throw new Error("Chat not found");
  } else {
    response.json(removeUser);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
