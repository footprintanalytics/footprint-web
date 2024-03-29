/* eslint-disable react/prop-types */
import { Table, ConfigProvider, theme } from "antd";
import React, { useState } from "react";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import getListPagination from "./getListPagination";
import getListColums from "./getListColums";
const { darkAlgorithm, defaultAlgorithm } = theme;

const HotList = ({ router, user, data, current, gaCategory, isNightMode }) => {
  const [dashboardCopyModal, setDashboardCopyModal] = useState({});
  const [cardCopyModal, setCardCopyModal] = useState({}); //query copy modal
  const [shareModalResource, setShareModalResource] = useState({});
  const [seoTaggingModal, setSeoTaggingModal] = useState({});
  const [homePriorityModal, setHomePriorityModal] = useState({});
  const searchWords = [];
  const device = useDeviceInfo();
  const showHeader = device.isPC;

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
    onSeoTagging: setSeoTaggingModal,
    onHomePriority: setHomePriorityModal,
    searchWords,
    device,
    canSort: false,
    gaCategory: gaCategory,
  });

  const pagination =
    (data?.total || 0) > 0 &&
    getListPagination({
      router,
      current: current,
      pageSize: data?.pageSize,
      total: data?.total,
    });

  return (
    <>
      <ConfigProvider theme={{
        algorithm: isNightMode ? darkAlgorithm : defaultAlgorithm,
      }}>
        <Table
          rowKey="publicUuid"
          className="dashboards__table"
          dataSource={data?.data}
          columns={columns}
          pagination={pagination}
          showHeader={showHeader}
        />
      </ConfigProvider>
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
            setShareModalResource({});
          }
        }}
        onClose={() => setShareModalResource({})}
      />
      {seoTaggingModal.id && (
        <TaggingModal
          onClose={() => setSeoTaggingModal({})}
          id={seoTaggingModal.id}
          name={seoTaggingModal.name}
          creatorId={seoTaggingModal.creatorId}
          type="dashboard"
        />
      )}
      {homePriorityModal.id && (
        <HomePriorityModal
          onClose={() => setHomePriorityModal({})}
          id={homePriorityModal.id}
          name={homePriorityModal.name}
          type="dashboard"
        />
      )}
    </>
  );
};

export default HotList;
