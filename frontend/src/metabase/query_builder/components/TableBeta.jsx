/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import { getTableConfigList } from "metabase/selectors/config";
import _ from "underscore";
import Tooltip from "metabase/components/Tooltip";

const TableBeta = ({ tableName, tableId, tableConfigList }) => {
  const betaTable =
    (tableId &&
      tableConfigList.find(
        item => item.id === tableId && item.type === "beta",
      )) ||
    (tableName &&
      tableConfigList.find(
        item => item.name === tableName && item.type === "beta",
      ));

  return (
    <React.Fragment>
      {betaTable && (
        <Tooltip
          tooltip={"Beta: data accuracy, stability, data period, update frequency,etc of this table is still on working."}
          verticalAttachments={["top", "bottom"]}
        >
          <span
            style={{
              size: 11,
              padding: "0 4px",
              background: "#F6F6FE",
              color: "#3434B2",
              margin: "0 2px",
            }}
          >
            Beta
          </span>
        </Tooltip>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = state => ({
  tableConfigList: getTableConfigList(state),
});

const mapDispatchToProps = {};

export default _.compose(connect(mapStateToProps, mapDispatchToProps))(
  React.memo(TableBeta),
);
