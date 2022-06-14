/* eslint-disable react/prop-types */
import React from "react";
import { Link as ReactRouterLink } from "react-router";
import styled from "styled-components";
import { display, color, hover, space } from "styled-system";
import { stripLayoutProps } from "metabase/lib/utils";

const BaseLink = ({ to, className, children, ...props }) => {
  let rel = "";
  let url = to || props.href;
  url = String(url);
  if (url.startsWith("http") && !url.includes("footprint.network")) {
    rel = "nofollow";
  }

  return (
    <ReactRouterLink
      to={to}
      rel={rel}
      className={className || "link"}
      {...stripLayoutProps(props)}
    >
      {children}
    </ReactRouterLink>
  );
};

const Link = styled(BaseLink)`
  ${display}
  ${space}
  ${hover}
  ${color}
`;

export default Link;
