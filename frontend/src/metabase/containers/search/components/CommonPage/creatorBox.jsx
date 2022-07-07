/* eslint-disable react/prop-types */
import React from "react";
import "../DataSet/Index.css";

const CreatorBox = ({ router, searchWords, item }) => {
  return (
    <>
      <div className="creator-box__container">
        <div>Dashboard count: {item?.dashboard_count}</div>
        <div>Chart count: {item?.card_count}</div>
      </div>
    </>
  );
};

export default CreatorBox;
