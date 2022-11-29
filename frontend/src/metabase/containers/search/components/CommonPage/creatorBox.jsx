/* eslint-disable react/prop-types */
import React from "react";
import "../DataSet/Index.css";

const CreatorBox = ({ router, searchWords, item }) => {
  return (
    <>
      <div className="creator-box__container">
        <div>
          Dashboard: <span className="bold">{item?.dashboard_count}</span>
        </div>
        <div>
          Chart: <span className="bold">{item?.card_count}</span>
        </div>
      </div>
    </>
  );
};

export default CreatorBox;
