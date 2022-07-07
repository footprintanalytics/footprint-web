/* eslint-disable react/prop-types */
import React from "react";
import "../DataSet/Index.css";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import getListColums from "metabase/containers/dashboards/components/Dashboards/getListColums";
import { has } from "lodash";

const DashboardBox = ({ router, user, searchWords, item, refetch }) => {
  const device = useDeviceInfo();

  const columns = getListColums({
    router,
    user,
    searchWords,
    device,
    isPlain: true,
  });

  return (
    <>
      <div className="creator-box__container">
        {columns.map(column => {
          if (has(column, "dataIndex")) {
            return column.render(item[column.dataIndex]);
          }
          return column.render(item, item);
        })}
      </div>
    </>
  );
};

export default DashboardBox;
