import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Tooltip } from "@chakra-ui/react";

/*
Component: Search user box.
- Render available users on search, create a new chat object 
if object does not exist.
*/

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  return (
    <>
      <Box>
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i className="fa-solid fa-magnifying-g13lass"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>
    </>
  );
};

export default SideDrawer;
