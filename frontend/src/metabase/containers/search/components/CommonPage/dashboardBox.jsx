/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../DataSet/Index.css";
import {
  getCreatorQueryLink,
  getDashboardQueryLink,
  getProtocolQueryLink,
  getSearchDashboardQueryLink,
  isCreator,
  isProtocol,
  isSearch,
} from "metabase/containers/dashboards/shared/utils";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { Table } from "antd";
import getListColums from "metabase/containers/dashboards/components/Dashboards/getListColums";
import { trackStructEvent } from "metabase/lib/analytics";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";

const DashboardBox = ({ router, user, searchWords, item, refetch }) => {
  const [dashboardCopyModal, setDashboardCopyModal] = useState({});
  const [cardCopyModal, setCardCopyModal] = useState({}); //query copy modal
  const [shareModalResource, setShareModalResource] = useState({});
  const [seoTaggingModal, setSeoTaggingModal] = useState({});
  const [homePriorityModal, setHomePriorityModal] = useState({});

  const device = useDeviceInfo();

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
    isPlain: true,
  });

  const renderTable = () => {
    return (
      <Table
        rowKey="publicUuid"
        className="dashboards__table dashboard-box__container"
        dataSource={[item]}
        columns={columns}
        showHeader={false}
        pagination={false}
        bordered={false}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === "sort") {
            let linkFunc = isProtocol()
              ? getProtocolQueryLink
              : isSearch() || isCreator()
              ? getSearchDashboardQueryLink
              : getDashboardQueryLink;
            if (isCreator()) {
              linkFunc = getCreatorQueryLink;
            }
            const link = linkFunc({
              ...router.location.query,
              current: 1,
              sortBy: sorter.columnKey,
              sortDirection: sortMap[sorter.order],
              location: router.location,
            });
            router.push(link);
            trackStructEvent("Dashboards Sort", sorter.columnKey);
          }
        }}
      />
    );
  };

  return (
    <>
      {renderTable()}

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
            refetch && refetch();
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
          onSuccess={() => refetch && refetch()}
          id={homePriorityModal.id}
          name={homePriorityModal.name}
          type="dashboard"
        />
      )}
    </>
  );
};

export default DashboardBox;
