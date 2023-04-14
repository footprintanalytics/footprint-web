/* eslint-disable react/prop-types */
import { message, Skeleton, Table } from "antd";
import { ownerTable, setTableBelongType } from "metabase/new-service";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { trackStructEvent } from "metabase/lib/analytics";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";
import getListPagination from "metabase/containers/dashboards/components/Dashboards/getListPagination";
import "./Index.css";
import "../../../protocols/index.css";
import "../../../protocols/components/Protocols/index.css";
import getListColums from "./getListColums";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { getCreatorQueryLink, isSearch } from "metabase/containers/dashboards/shared/utils";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import getListQueryParams from "metabase/containers/search/components/MyTables/getListQueryParams";

const Index = ({ router, user }) => {
  const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
  const params = getListQueryParams(router.location.query);
  const device = useDeviceInfo();
  const showHeader = device.isPC;
  const [showVip, setShowVip] = useState(false);

  const { isLoading, data, error, refetch } = useQuery(
    ["ownerTable", params],
    async () => {
      return ownerTable(params);
    },
    QUERY_OPTIONS,
  );

  if (error || isLoading) {
    return (
      <div className="dashboards__table">
        <Skeleton active />
      </div>
    );
  }

  if (data?.data?.length === 0) {
    return <NoData />;
  }


  const setTableType = async ({ tableId, belongType }) => {
    if (!isPaidUser) {
      setShowVip(true);
      return ;
    }
    const hide = message.loading("Loading...", 0);
    await setTableBelongType({
      "tableId": tableId,
      "belongType": belongType === "private" ? "public": "private"
    })
    await refetch();
    hide();
  }

  const jumpToChart = ({ chartId }) => {
    window.open(`/chart/${chartId}`);
  }

  const columns = getListColums({
    router,
    user,
    device,
    setTableBelongType: setTableType,
    jumpToChart,
  });

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  return (
    <>
      <Table
        rowKey="id"
        className="dashboards__table"
        dataSource={data?.data}
        columns={columns}
        pagination={pagination}
        showHeader={showHeader}
        rowClassName={(record, index) => {
          return index % 2 === 1
            ? "dashboards__table-columns-odd"
            : "dashboards__table-columns-even";
        }}
        onChange={(pagination, filters, sorter, extra) => {
          const link = getCreatorQueryLink({
            ...router.location.query,
            current: pagination.current,
            sortBy: sorter.columnKey,
            sortDirection: sortMap[sorter.order],
            location: router.location,
          });
          router.push(link);
          trackStructEvent("search my-tables Sort", sorter.columnKey);
        }}
      />
      {showVip && (
        <NeedPermissionModal
          title="Upgrade your account to access more function"
          onClose={() => setShowVip(false)}
        />
      )}
    </>
  );
};

export default Index;
