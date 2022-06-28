import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [updateChat, setUpdateChat] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats updateChat={updateChat} />}
        {user && (
          <ChatBox updateChat={updateChat} setUpdateChat={setUpdateChat} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
