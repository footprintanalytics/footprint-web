/* eslint-disable react/prop-types */
import { Skeleton, Table, Modal } from "antd";
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
import { getCreatorQueryLink } from "metabase/containers/dashboards/shared/utils";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import getListQueryParams from "metabase/containers/search/components/MyTables/getListQueryParams";
import { isFgaPath } from "metabase/growth/utils/utils";

const Index = ({ router, user }) => {
  const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
  const params = getListQueryParams(router.location.query);
  const device = useDeviceInfo();
  const showHeader = device.isPC;
  const isFga = isFgaPath();
  const [showVip, setShowVip] = useState(false);

  const [open, setOpen] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = async () => {
    setConfirmLoading(true);
    await setTableBelongType({
      tableId: open.tableId,
      belongType: open.belongType === "private" ? "public" : "private",
    });
    await refetch();
    setOpen({ open: false });
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setOpen({ open: false });
  };

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
      return;
    }
    setOpen({ open: true, tableId, belongType });
  };

  const jumpToChart = ({ chartId }) => {
    window.open(`${isFga?'/growth':''}/chart/${chartId}`);
  };

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
            ? `dashboards__table-columns-odd${isFga && "-dark"}`
            : `dashboards__table-columns-even${isFga && "-dark"}`;
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
          title="Upgrade to the Business Plan to protect your data privacy"
          onClose={() => setShowVip(false)}
        />
      )}
      <Modal
        title="Prompt"
        open={open.open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{`Do you set this data to ${
          open.belongType === "private" ? "public" : "private"
        } ?`}</p>
      </Modal>
    </>
  );
};

export default Index;
