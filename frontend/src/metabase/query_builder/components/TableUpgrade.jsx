/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import connect from "react-redux/lib/connect/connect";
import _ from "underscore";
import Icon from "metabase/components/Icon";
import { getTableConfigList } from "metabase/selectors/config";

const TableUpgrade = ({ tableName, tableId, nativeQuery, tableConfigList }) => {
  const [enable, setEnable] = useState(true);
  if (!enable) {
    return null;
  }
  const matchBetaTableFromNative = type => {
    return tableConfigList
      .filter(item => item.type === type)
      .map(item => (nativeQuery?.includes(item.name) ? item : null))
      .filter(item => item);
  };

  const getTables = type => {
    if (nativeQuery) {
      return matchBetaTableFromNative(type);
    }
    return (
      (tableId &&
        tableConfigList.filter(
          item => item.id === tableId && item.type === type,
        )) ||
      (tableName &&
        tableConfigList.filter(
          item => item.name === tableName && item.type === type,
        ))
    );
  };

  const upgradeTables = getTables("upgrade");
  const deprecateTables = getTables("deprecate");
  const getShowInfo = ({ upgradeTables, deprecateTables }) => {
    let result = "";
    if (upgradeTables?.length > 0) {
      result += upgradeTables.map(table => `${table?.message}`).join(",");
    }
    if (deprecateTables?.length > 0) {
      result += deprecateTables.map(table => `${table?.message}`).join(",");
    }
    return result ? <span>{result}</span> : null;
  };
  const showInfo = getShowInfo({ upgradeTables, deprecateTables });
  return (
    <React.Fragment>
      {showInfo && (
        <div
          style={{
            size: 11,
            padding: "8px 18px",
            background: "#F9FBFC",
            color: "#ED6E6E",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {showInfo}
          <Icon
            name="close"
            onClick={() => {
              setEnable(false);
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = state => ({
  tableConfigList: getTableConfigList(state),
});

const mapDispatchToProps = {};

export default _.compose(connect(mapStateToProps, mapDispatchToProps))(
  React.memo(TableUpgrade),
);
