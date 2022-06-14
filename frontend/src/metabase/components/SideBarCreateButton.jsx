/* eslint-disable react/prop-types */

import React from "react";
import { Box } from "grid-styled";
import Link from "metabase/components/Link";
import { Tooltip } from "antd";

function SideBarCreateButton({ onClick, collapsed }) {
  if (collapsed) {
    return (
      <Link onClick={() => onClick && onClick()}>
        <Tooltip placement="right" title="Create">
          <Box pt={10} pb={10} mb={15} className="flex justify-center">
            <Box px={30} py={14} className="flex align-center">
              <div className="create_image" />
            </Box>
          </Box>
        </Tooltip>
      </Link>
    );
  }
  return (
    <Link onClick={() => onClick && onClick()}>
      <Box pt={20} pb={20} mb={20} className="flex justify-center">
        <Box
          px={30}
          py={14}
          className="flex align-center"
          style={{
            borderRadius: "32px",
            boxShadow: "0 2px 10px #C0D7F3",
          }}
        >
          <div className="create_image" />
          <Box
            className="text-bold"
            ml={16}
            style={{ color: "#3434B2", fontSize: "18px" }}
          >
            Create
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

export default SideBarCreateButton;
