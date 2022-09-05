/* eslint-disable curly */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { memo, useState } from "react";
import connect from "react-redux/lib/connect/connect";
import { getTableConfigList } from "metabase/selectors/config";
import { compose } from "underscore";
import Icon from "metabase/components/Icon";
import { get } from "lodash";
import "./TableChartInfo.css";
import Link from "metabase/components/Link";
import { getTableNameListFromSQL } from "metabase/lib/formatting";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TableChartInfoModel from "metabase/query_builder/components/TableChartInfoModal";
import { getDashboardParameters } from "metabase/dashboard/actions";
import { Popover } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";

const TableChartInfo = ({
  className = "",
  tableName,
  tableId,
  tableConfigList,
  deprecatedTableConfigList,
  executionErrorList,
  card,
  dashcard,
  dashboard,
  getDashboardParameters,
}) => {
  console.log("TableChartInfo", { card, dashcard, executionErrorList });
  const tableTipObject = {
    defi_protocol_daily_stats:
      "https://docs.footprint.network/changelog/tables/defi_protocol_daily_stats",
    protocol_transactions:
      "https://docs.footprint.network/changelog/tables/protocol_transactions",
    protocol_active_address:
      "https://docs.footprint.network/changelog/tables/protocol_active_address",
    protocol_daily_stats:
      "https://docs.footprint.network/changelog/tables/protocol_daily_stats",
    token_daily_stats:
      "https://docs.footprint.network/changelog/tables/token_daily_stats",
    gamefi_protocol_daily_stats:
      "https://docs.footprint.network/changelog/tables/gamefi_protocol_daily_stats",
  };
  const nativeQuery =
    card?.dataset_query?.type === "native" &&
    get(card, "dataset_query.native.query");

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
    if (type === "upgrade" && deprecatedTableConfigList?.length) {
      return deprecatedTableConfigList;
    }
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

  const getUdTables = () => {
    if (nativeQuery) {
      const tableNameList = getTableNameListFromSQL(nativeQuery);
      return tableNameList?.filter(s => s.startsWith("ud_")) || [];
    }
    if (tableName?.includes("ud_")) return [tableName];
    return [];
  };

  const getShowInfo = ({
    udTables,
    betaTables,
    upgradeTables,
    unknownColumn,
  }) => {
    let udTableNode = null;
    if (udTables?.length > 0) {
      udTableNode = udTables?.map(table => (
        <li key={table}>
          {table}:
          <Link
            to="https://docs.footprint.network/data/data-sources"
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
        </li>
      ));
    }

    let betaTableNode = null;
    if (betaTables?.length > 0) {
      betaTableNode = betaTables?.map(table => (
        <li key={table.id}>
          {table.name}:
          <Link
            to="https://docs.footprint.network/data/naming-convention"
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
        </li>
      ));
    }

    let upgradeNode = null;
    if (upgradeTables?.length > 0) {
      upgradeNode = upgradeTables?.map(table => (
        <li
          key={table?.id}
          dangerouslySetInnerHTML={{ __html: table?.message }}
        />
      ));
    }

    let unknownColumnNode = null;
    if (unknownColumn) {
      const link = tableTipObject[unknownColumn.table];
      console.log("linklink", link, unknownColumn, unknownColumn.table);
      if (link) {
        unknownColumnNode = (
          <li key={`${unknownColumn.table}${unknownColumn.column}`}>
            <span>
              This chart seems to have some problems, you can first check if the
              fields used have been updated:
              <Link className="text-underline ml1" to={link} target="_blank">
                Link
              </Link>
            </span>
          </li>
        );
      }
    }
    console.log("unknownColumnunknownColumn", unknownColumnNode);
    return udTableNode || betaTableNode || upgradeNode || unknownColumnNode ? (
      <div className="table-chart-info-show">
        <div className="table-chart-info-show-l">
          <ExclamationCircleFilled style={{ color: "#faad14" }} />
        </div>
        <div className="table-chart-info-show-r">
          {/*<div>Table Info: </div>*/}
          <ul>
            {udTableNode}
            {betaTableNode}
            {upgradeNode}
            {unknownColumnNode}
          </ul>
        </div>
      </div>
    ) : null;
  };

  const udTables = getUdTables();
  const betaTables = getTables("beta");
  const upgradeTables = getTables("upgrade");
  console.log("get(executionErrorList, 0)", get(executionErrorList, 0));
  const unknownColumn =
    dashcard?.executionError?.unknownColumn ||
    card?.executionError?.unknownColumn ||
    get(executionErrorList, 0)?.unknownColumn;
  console.log("unknownColumn333", unknownColumn);
  const showInfo = getShowInfo({
    udTables,
    betaTables,
    upgradeTables,
    unknownColumn,
  });
  const [showModal, setShowModal] = useState(null);
  const showRedIcon =
    (upgradeTables && upgradeTables?.length > 0) || unknownColumn;
  console.log("showInfo", showInfo);
  return (
    <>
      {card ? (
        <a
          className={`html2canvas-filter ${
            showRedIcon ? "table-chart-info-icon" : "dash-card__button"
          } ${className}`}
          onClick={async () => {
            const result =
              dashboard && card && dashcard
                ? (await getDashboardParameters(card, dashcard))?.payload
                : {};
            setShowModal(result);
            if (dashboard) {
              trackStructEvent("dashboard click chart info");
            } else {
              trackStructEvent("chart click chart info");
            }
          }}
          style={{ top: 1 }}
        >
          <Icon
            name={"info"}
            size={15}
            color={showRedIcon ? "#ff0000" : "#9AA0AF"}
          />
        </a>
      ) : showInfo ? (
        <Popover
          overlayClassName="table-chart-info"
          placement="right"
          content={showInfo}
        >
          <a
            className={`html2canvas-filter table-chart-info-icon ${className}`}
          >
            <Icon name={"dialogue"} size={15} color={"#9AA0AF"} />
          </a>
        </Popover>
      ) : (
        <div />
      )}
      {showModal && (
        <TableChartInfoModel
          showInfo={showInfo}
          cardId={get(card, "id")}
          parameters={showModal?.parameters}
          dashboardId={get(dashboard, "entityId") || get(dashboard, "id")}
          onCancel={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  tableConfigList: getTableConfigList(state),
});

const mapDispatchToProps = {
  getDashboardParameters: getDashboardParameters,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  memo(TableChartInfo),
);
