/* eslint-disable react/prop-types */
import { Skeleton, Table } from "antd";
import { elasticSearch } from "metabase/new-service";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { trackStructEvent } from "metabase/lib/analytics";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import { getSearchTexts } from "metabase/nav/components/utils";
import getListQueryParams from "metabase/containers/dashboards/components/Dashboards/getListQueryParams";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";
import getListPagination from "metabase/containers/dashboards/components/Dashboards/getListPagination";
import "./Index.css";
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
import getListColums from "./getListColums";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";
import { useDeviceInfo } from "metabase-lib/lib/Device";

const CommonPage = ({ router, user }) => {
  const [dashboardCopyModal, setDashboardCopyModal] = useState({});
  const [cardCopyModal, setCardCopyModal] = useState({}); //query copy modal
  const [shareModalResource, setShareModalResource] = useState({});
  const [seoTaggingModal, setSeoTaggingModal] = useState({});
  const [homePriorityModal, setHomePriorityModal] = useState({});
  const searchWords = getSearchTexts(router.location.query.q);
  const device = useDeviceInfo();
  const showHeader = device.isPC;
  const params = {
    ...getListQueryParams(router.location.query),
  };

  const { isLoading, data, error, refetch } = useQuery(
    ["elasticSearch", params],
    async () => {
      return elasticSearch(params);
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

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

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

  return (
    <>
      {isSearch() && data?.isFeature && <NoData />}
      {isSearch() && data?.isFeature && (
        <div className="dashboards__recommend">Recommend</div>
      )}
      <Table
        rowKey="publicUuid"
        className="dashboards__table dashboard-box__container"
        dataSource={data?.data}
        columns={columns}
        pagination={pagination}
        showHeader={showHeader}
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

export default CommonPage;
