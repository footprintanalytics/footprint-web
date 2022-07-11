/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import connect from "react-redux/lib/connect/connect";
import _ from "underscore";
import Icon from "metabase/components/Icon";
import { getTableConfigList } from "metabase/selectors/config";
import { get } from "lodash";
import { getTableNameListFromSQL } from "metabase/lib/formatting";

const TableUpgrade = ({ tableName, tableId, card, tableConfigList }) => {
  const nativeQuery =
    card?.dataset_query?.type === "native" &&
    get(card, "dataset_query.native.query");
  const [enable, setEnable] = useState(true);
  if (!enable) {
    return null;
  }
  const matchNativeQuery = tableName => {
    const tableNameList = getTableNameListFromSQL(nativeQuery);
    return tableNameList?.filter(s => s === tableName.toLowerCase()) || [];
  };
  const matchTableFromNative = type => {
    return tableConfigList
      .filter(item => item.type === type)
      .map(item => (matchNativeQuery(item.name).length > 0 ? item : null))
      .filter(item => item);
  };

  const getTables = type => {
    if (nativeQuery) {
      return matchTableFromNative(type);
    }
    return (
      (tableId &&
        tableConfigList?.filter(
          item => item.id === tableId && item.type === type,
        )) ||
      (tableName &&
        tableConfigList?.filter(
          item => item.name === tableName && item.type === type,
        ))
    );
  };

  const getShowInfo = ({ upgradeTables }) => {
    let upgradeNode = null;
    if (upgradeTables?.length > 0) {
      upgradeNode = upgradeTables?.map(table => (
        <div
          key={table?.id}
          dangerouslySetInnerHTML={{ __html: table?.message }}
        />
      ));
    }
    return upgradeNode ? <div>{upgradeNode}</div> : null;
  };

  const upgradeTables = getTables("upgrade");
  const showInfo = getShowInfo({ upgradeTables });
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
            className="ml1"
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
