/* eslint-disable react/prop-types */
import { Pagination, Skeleton, Table } from "antd";
import {
  elasticSearch,
  fetchHomeNewCategoryDashboard,
  getFavorite,
  getLandingDetailMore,
  navigationSearch,
} from "metabase/new-service";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { QUERY_OPTIONS, sortMap } from "../../shared/config";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import getListColums from "./getListColums";
import getListPagination from "./getListPagination";
import getListQueryParams from "./getListQueryParams";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { getSearchTexts } from "metabase/nav/components/utils";
import {
  getCreatorQueryLink,
  getDashboardQueryLink,
  getProtocolQueryLink,
  getSearchDashboardQueryLink,
  isCreator,
  isProtocol,
  isSearch,
} from "../../shared/utils";
import { trackStructEvent } from "metabase/lib/analytics";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";
import ExplorerList from "../../../explore/components/List";
import "../../../explore/index.css";

const List = ({ router, user, protocolName, name, isList = true }) => {
  const [dashboardCopyModal, setDashboardCopyModal] = useState({});
  const [cardCopyModal, setCardCopyModal] = useState({}); //query copy modal
  const [shareModalResource, setShareModalResource] = useState({});
  const [seoTaggingModal, setSeoTaggingModal] = useState({});
  const [homePriorityModal, setHomePriorityModal] = useState({});

  const searchWords = isSearch() ? getSearchTexts(router.location.query.q) : [];
  const params = isProtocol()
    ? { protocol_name: protocolName }
    : {
        ...getListQueryParams(router.location.query),
        ...(name && { name: name }),
      };

  const { isLoading, data, error, refetch } = useQuery(
    [
      "navigationSearch",
      "elasticSearch",
      "fetchHomeNewCategoryDashboard",
      "getLandingDetailMore",
      "protocol",
      router.location.pathname,
      user?.id,
      params,
    ],
    async () => {
      if (isProtocol()) {
        return getLandingDetailMore("protocol", params);
      }
      if (isSearch()) {
        return elasticSearch(params);
      }
      if (isCreator()) {
        if (router?.location?.query?.model === "favorites") {
          const favoriteParams = {
            pageSize: params.pageSize,
            current: params.current,
            sortColumn: params.sortBy || "favorite_time",
            sortDirection: params.sortDirection,
          };
          return getFavorite({ params: favoriteParams });
        }
        return navigationSearch(params);
      }
      return fetchHomeNewCategoryDashboard(params);
    },
    QUERY_OPTIONS,
  );

  const device = useDeviceInfo();
  const showHeader = device.isPC;

  if (error || isLoading) {
    return (
      <div className="dashboards__table">
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
    onSeoTagging: setSeoTaggingModal,
    onHomePriority: setHomePriorityModal,
    searchWords,
    device,
  });

  const pagination =
    data?.total &&
    getListPagination({
      router,
      current: params.current,
      pageSize: data?.pageSize,
      total: data?.total,
    });
  if (isProtocol() && data?.data.length === 0) {
    return null;
  }

  const renderGrid = () => {
    return (
      <div className="dashboards__grid">
        <ExplorerList
          location={router?.location}
          exploreList={data?.data}
          exploreTotal={data?.total}
          createPanel={false}
          showArchiveButton={
            isCreator() && router?.location?.query?.model !== "favorites"
          }
          onAfterChangePublicUuid={() => refetch()}
          favoriteClickSuccess={() => refetch()}
          archiveSuccess={() => refetch()}
        />
        <Pagination className="dashboards__news-pagination" {...pagination} />
      </div>
    );
  };

  const renderTable = () => {
    return (
      <Table
        rowKey="publicUuid"
        className="dashboards__table"
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
    );
  };

  return (
    <>
      {isSearch() && data?.isFeature && <NoData />}
      {isSearch() && data?.isFeature && (
        <div className="dashboards__recommend">Recommend</div>
      )}
      {isProtocol() && data?.total && (
        <div className="dashboards__more-relevant-dashboard">
          More Relevant Dashboard
        </div>
      )}
      {isList ? renderTable() : renderGrid()}

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
          onSuccess={() => refetch()}
          id={homePriorityModal.id}
          name={homePriorityModal.name}
          type="dashboard"
        />
      )}
    </>
  );
};

export default List;
