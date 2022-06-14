import React from "react";
import PropTypes from "prop-types";
import AccountHeader from "../AccountHeader";
import { AccountContent } from "./AccountLayout.styled";
import "./AccountLayout.css";

const propTypes = {
  ...AccountHeader.propTypes,
  children: PropTypes.node,
};

const AccountLayout = ({ children, ...props }) => {
  return (
    <div className="AccountLayout">
      <div className="AccountLayout__header">
        <AccountHeader {...props} />
      </div>
      <AccountContent>
        <div className="AccountLayout__content">{children}</div>
      </AccountContent>
    </div>
  );
};

AccountLayout.propTypes = propTypes;

export default AccountLayout;
