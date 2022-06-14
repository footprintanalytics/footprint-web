/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import List from "./List";
// import Sort from "./Sort";
import Category from "./Category";

const Protocols = ({ router, user }) => {
  return (
    <div>
      <div className="protocols__cell">
        <h2>Discover Protocols on Footprint</h2>
      </div>
      <div className="protocols__filter">
        <Category router={router} name="Category" />
        <Category router={router} name="Chain" />
        <Category router={router} name="Genre" />
      </div>
      <List user={user} router={router} />
    </div>
  );
};

export default Protocols;
