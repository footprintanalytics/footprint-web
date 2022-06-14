/* eslint-disable react/prop-types */
import { Skeleton, Table } from "antd";
import { getLandingList } from "metabase/new-service";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "../../shared/config";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import getListColums from "./getListColums";
import getListPagination from "./getListPagination";
import getListQueryParams from "./getListQueryParams";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { protocolsDetailUrl } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";

const List = ({ router, user }) => {
  const [dashboardCopyModal, setDashboardCopyModal] = useState({});
  const [cardCopyModal, setCardCopyModal] = useState({}); //query copy modal
  const [shareModalResource, setShareModalResource] = useState({});

  const params = getListQueryParams(router.location.query);

  const { isLoading, data, error, refetch } = useQuery(
    ["getLandingList", "protocol", params],
    async () => {
      return getLandingList("protocol", params);
    },
    QUERY_OPTIONS,
  );

  const device = useDeviceInfo();
  const showHeader = device.isPC;

  if (error || isLoading) {
    return (
      <div className="protocols__table">
        <Skeleton active />
      </div>
    );
  }

  const columns = getListColums({
    router,
    user,
    onDuplicate: params => {
      if (params.type === "dashboard") {
        setDashboardCopyModal(params);
      } else {
        setCardCopyModal(params);
      }
    },
    onShare: setShareModalResource,
    device,
  });

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  const getUrl = record => {
    return protocolsDetailUrl({
      title: `${record.type} ${record.protocol_name}`,
      protocolId: record.protocol_id,
    });
  };

  return (
    <>
      <div className="protocols__total">{data?.total} Protocols</div>
      <Table
        rowKey="publicUuid"
        className="protocols__table"
        dataSource={data?.data}
        columns={columns}
        pagination={pagination}
        showHeader={showHeader}
        onRow={record => {
          return {
            onClick: () => {
              trackStructEvent("Protocols Name", record.name);
              router.push(getUrl(record));
            },
          };
        }}
      />
      <DashboardCopyModal
        isOpen={!!dashboardCopyModal.id}
        onClose={() => setDashboardCopyModal({})}
        dashboardId={dashboardCopyModal.id}
        dashboard={{
          name: dashboardCopyModal.name,
          description: dashboardCopyModal.description,
        }}
        fromRoute={false}
      />
      <QueryCopyModal
        open={!!cardCopyModal.id}
        cardId={cardCopyModal.id}
        name={cardCopyModal.name}
        description={cardCopyModal.description}
        onClose={() => setCardCopyModal({})}
      />
      <ShareModal
        resource={shareModalResource}
        onAfterChangePublicUuid={({ newUuid }) => {
          if (!newUuid) {
            refetch();
            setShareModalResource({});
          }
        }}
        onClose={() => setShareModalResource({})}
      />
    </>
  );
};

export default List;
