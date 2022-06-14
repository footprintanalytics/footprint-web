/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import React from "react";
import Icon from "metabase/components/Icon";
import moment from "moment";

const DataUpdateTime = () => {
  const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
  const yesterdayFormat = moment(yesterday).format("YYYY-MM-DD");
  return (
    <div className="flex flex-row justify-end align-center pt1 pb1 html2canvas-filter">
      <Icon name="data_update" color="#7a819a" size={16} />
      <span className="ml1" style={{ color: "#7A819B" }}>
        Data last updated {yesterdayFormat}
      </span>
    </div>
  );
};
export default DataUpdateTime;
