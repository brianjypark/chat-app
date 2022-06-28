import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
/*
Component: 

*/

const ChatBox = ({ updateChat, setUpdateChat }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="1g"
      borderWidth="1px"
    >
      <SingleChat updateChat={updateChat} setUpdateChat={setUpdateChat} />
    </Box>
  );
};

export default ChatBox;
