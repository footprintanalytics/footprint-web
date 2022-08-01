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
  card,
  dashcard,
  dashboard,
  getDashboardParameters,
}) => {
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

  const getShowInfo = ({ udTables, betaTables, upgradeTables }) => {
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

    return udTableNode || betaTableNode || upgradeNode ? (
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
          </ul>
        </div>
      </div>
    ) : null;
  };

  const udTables = getUdTables();
  const betaTables = getTables("beta");
  const upgradeTables = getTables("upgrade");
  const showInfo =
    tableConfigList && getShowInfo({ udTables, betaTables, upgradeTables });
  const [showModal, setShowModal] = useState(null);

  return (
    <>
      {card ? (
        <a
          className={`html2canvas-filter ${
            showInfo ? "table-chart-info-icon" : "dash-card__button"
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
          style={{ top: 2, height: 18 }}
        >
          <Icon
            name={"table_info"}
            size={18}
            color={showInfo ? "#ff0000" : "#9AA0AF"}
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
            <Icon name={"dialogue"} size={16} color={"#9AA0AF"} />
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
