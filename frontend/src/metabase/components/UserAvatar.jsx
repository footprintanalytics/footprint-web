import React from "react";
import styled from "styled-components";
import { Flex } from "grid-styled";
import { height } from "styled-system";

const Avatar = styled(Flex).attrs({
  align: "center",
  justifyContent: "center",
  height: ({ size }) => size,
  width: ({ size }) => size,
  fontSize: ({ size }) => size * 0.75,
})`
  ${height};
  border-radius: 999px;
  font-weight: 600;
  line-height: 1;
`;

Avatar.defaultProps = {
  bg: "#E3E3FF",
  color: "#3434B2",
  size: ["3em"],
};

function initial(name) {
  return typeof name === "string" ? name.charAt(0).toUpperCase() : "";
}

function userInitials(user) {
  return !user.avatar ? (
    initial(user.name)
  ) : (
    <img
      src={user.avatar + "?x-oss-process=image/resize,m_fill,h_120,w_120"}
      style={{ borderRadius: "50%", width: "100%" }}
    />
  );
  // return user ? initial(user.first_name) + initial(user.last_name) : null;
}

const UserAvatar = styled(Avatar).attrs({
  children: ({ user }) => userInitials(user) || "?",
})``;

export default UserAvatar;
