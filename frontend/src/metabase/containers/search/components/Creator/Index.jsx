/* eslint-disable react/prop-types */
import { Skeleton, Table } from "antd";
import { elasticSearch } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import { trackStructEvent } from "metabase/lib/analytics";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import getListQueryParams from "./getListQueryParams";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";
import getListPagination from "metabase/containers/dashboards/components/Dashboards/getListPagination";
import "./Index.css";
import "../../../protocols/index.css";
import "../../../protocols/components/Protocols/index.css";
import getListColums from "./getListColums";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import {
  getCreatorQueryLink,
  isSearch,
} from "metabase/containers/dashboards/shared/utils";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import * as Urls from "metabase/lib/urls";

const Index = ({ router, user }) => {
  const params = getListQueryParams(router.location.query);
  const device = useDeviceInfo();
  const showHeader = device.isPC;

  const { isLoading, data, error } = useQuery(
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

  const columns = getListColums({
    router,
    user,
    device,
  });

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  return (
    <>
      {isSearch() && data?.isFeature && <NoData />}
      {isSearch() && data?.isFeature && (
        <div className="dashboards__recommend">Recommend</div>
      )}
      <Table
        rowKey="id"
        className="dashboards__table"
        dataSource={data?.data}
        columns={columns}
        pagination={pagination}
        showHeader={showHeader}
        onRow={item => {
          return {
            onClick: () => {
              trackStructEvent("search creator click Name", item.name);
              router.push.open(Urls.creatorUrl(item));
            },
          };
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
          trackStructEvent("search creator Sort", sorter.columnKey);
        }}
      />
    </>
  );
};

export default Index;
