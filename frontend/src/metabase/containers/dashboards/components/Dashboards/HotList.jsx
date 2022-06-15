/* eslint-disable react/prop-types */
import { Table } from "antd";
import React, { useState } from "react";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import getListColums from "./getListColums";
import getListPagination from "./getListPagination";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";

const HotList = ({ router, user, data, current }) => {
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
      {/* 列表 */}
      <Table
        rowKey="publicUuid"
        className="dashboards__table"
        dataSource={data?.data}
        columns={columns}
        pagination={pagination}
        showHeader={showHeader}
      />
      {/* 复制 */}
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
      {/* 复制 */}
      <QueryCopyModal
        open={!!cardCopyModal.id}
        cardId={cardCopyModal.id}
        name={cardCopyModal.name}
        description={cardCopyModal.description}
        onClose={() => setCardCopyModal({})}
      />
      {/* 分享 */}
      <ShareModal
        resource={shareModalResource}
        onAfterChangePublicUuid={({ newUuid }) => {
          if (!newUuid) {
            setShareModalResource({});
          }
        }}
        onClose={() => setShareModalResource({})}
      />
      {/* seo 标签 keyword */}
      {seoTaggingModal.id && (
        <TaggingModal
          onClose={() => setSeoTaggingModal({})}
          id={seoTaggingModal.id}
          name={seoTaggingModal.name}
          creatorId={seoTaggingModal.creatorId}
          type="dashboard"
        />
      )}
      {/* dashboard 排序 */}
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
