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
import Link from "metabase/components/Link";

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

  const getUdTables = () => {
    if (nativeQuery) {
      const reg = /(?<=from|join)(\s|`)+(\w|`)+/g;
      return (
        nativeQuery
          ?.match(reg)
          ?.map(s =>
            s
              .trim()
              .toLowerCase()
              .replace(/`/g, ""),
          )
          ?.filter(s => s.startsWith("ud_")) || []
      );
    }
    if (tableName?.includes("ud_")) {
      return [tableName];
    }
    return [];
  };
  const udTables = getUdTables();
  const betaTables = getTables("beta");
  const upgradeTables = getTables("upgrade");
  const getShowInfo = ({ udTables, betaTables, upgradeTables }) => {
    let upgradeNode = "";
    let udTableNode = null;
    if (udTables?.length > 0) {
      udTableNode = udTables.map(table => (
        <div key={table}>
          {table}:
          <Link
            to="https://docs.footprint.network/data-1/data-model"
            target="_blank"
            style={{
              size: 11,
              padding: "0 4px",
              background: "#F6F6FE",
              color: "#3434B2",
              margin: "0 2px",
            }}
          >
            User Define
          </Link>
        </div>
      ));
    }
    let betaTableNode = null;
    if (betaTables?.length > 0) {
      betaTableNode = betaTables.map(table => (
        <div key={table.id}>
          {table.name}:
          <Link
            to="https://docs.footprint.network/data-1/data-model"
            target="_blank"
            style={{
              size: 11,
              padding: "0 4px",
              background: "#F6F6FE",
              color: "#3434B2",
              margin: "0 2px",
            }}
          >
            Beta
          </Link>
        </div>
      ));
    }
    if (upgradeTables?.length > 0) {
      upgradeNode = upgradeTables.map(table => (
        <div
          key={table?.id}
          dangerouslySetInnerHTML={{ __html: table?.message }}
        />
      ));
    }
    return udTableNode || betaTableNode || upgradeNode ? (
      <div style={{ whiteSpace: "pre-line" }}>
        {"Table Info: \n"}
        {udTableNode}
        {betaTableNode}
        {upgradeNode}
      </div>
    ) : null;
  };
  const showInfo =
    tableConfigList && getShowInfo({ udTables, betaTables, upgradeTables });

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
          okType="ghost"
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
            <Icon name={"dialogue"} size={16} color={"#9AA0AF"} />
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
