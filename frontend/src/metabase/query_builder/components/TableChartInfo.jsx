/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import { getTableConfigList } from "metabase/selectors/config";
import _ from "underscore";
import Icon from "metabase/components/Icon";
import { get } from "lodash";
import { Popconfirm } from "antd";
import "./TableChartInfo.css";

const TableChartInfo = ({ tableName, tableId, tableConfigList, card }) => {
  const nativeQuery =
    card?.dataset_query?.type === "native" &&
    get(card, "dataset_query.native.query");
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

  const getUdTable = () => {
    if (nativeQuery) {
      return "";
    }
    if (tableName.includes("ud_")) {
      return tableName;
    }
    return "";
  };
  const udTable = getUdTable();
  const betaTables = getTables("beta");
  const upgradeTables = getTables("upgrade");
  const deprecateTables = getTables("deprecate");
  const getShowInfo = ({
    udTable,
    betaTables,
    upgradeTables,
    deprecateTables,
  }) => {
    let result = "";
    if (udTable) {
      result += `This chart uses the ud table(ud table is contributed by the community): \n${udTable}\n`;
    }
    if (betaTables?.length > 0) {
      result += "This chart uses the beta table(beta table is in progress):\n";
      result += `[${betaTables
        .map(table => `${table?.name}`)
        .join(", ")} ] \n\n`;
    }
    if (upgradeTables?.length > 0) {
      result += upgradeTables.map(table => `${table?.message}\n`).join("");
    }
    if (deprecateTables?.length > 0) {
      result += deprecateTables.map(table => `${table?.message}\n`).join("");
    }
    return result ? (
      <div style={{ whiteSpace: "pre-line" }}>{result}</div>
    ) : null;
  };
  const showInfo =
    tableConfigList &&
    getShowInfo({ udTable, betaTables, upgradeTables, deprecateTables });

  return (
    <React.Fragment>
      {showInfo && (
        <Popconfirm
          overlayClassName="table-chart-info"
          placement="bottom"
          title={showInfo}
          okText="OK"
          icon={false}
          showCancel={false}
        >
          <a
            className="html2canvas-filter"
            style={{
              display: "inline",
              position: "relative",
              cursor: "pointer",
              margin: "0px 10px",
            }}
            onClick={() => {}}
          >
            <Icon name={"info"} size={14} color={"#9AA0AF"} />
          </a>
        </Popconfirm>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = state => ({
  tableConfigList: getTableConfigList(state),
});

const mapDispatchToProps = {};

export default _.compose(connect(mapStateToProps, mapDispatchToProps))(
  React.memo(TableChartInfo),
);
