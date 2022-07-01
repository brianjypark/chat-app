const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = expressAsyncHandler(async (request, response) => {
  const { content, chatId } = request.body;

  if (!content || !chatId) {
    console.log("Request Error: Invalid data");
    return response.sendStatus(400);
  }

  let newMessage = {
    sender: request.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(request.body.chatId, {
      recentMessage: message,
    });

    response.json(message);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

const allMessages = expressAsyncHandler(async (request, response) => {
  try {
    const messages = await Message.find({ chat: request.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");

    response.json(messages);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
