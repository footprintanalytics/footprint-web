/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React from "react";
import { useQuery } from "react-query";
import { tutorialsMenuDetail } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import Item from "metabase/containers/dashboards/components/Recommendations/Item";
import { Pagination, Skeleton } from "antd";
import NoData from "metabase/containers/news/components/NoData";
import { articleDetailUrl } from "metabase/lib/urls";
import { groupBy, every } from "lodash";
import { formatSectionTitle } from "metabase/lib/formatting";
import getListPagination from "./getListPagination";

const Content = ({ router, subMenu, category }) => {
  const params = {
    menu: category,
    subMenu: subMenu,
    pageSize: subMenu === "tutorial" ? 1000 : 10,
    current: router?.location?.query?.current || 1,
  };

  const { isLoading, data } = useQuery(
    ["tutorialsMenuDetail", params],
    async () => {
      return await tutorialsMenuDetail(params);
    },
    { ...QUERY_OPTIONS, enabled: !!subMenu && !!category },
  );
  if (isLoading) {
    return <Skeleton className="edu__right-container" active />;
  }

  if (category && subMenu && !(data?.data?.length > 0)) {
    return (
      <div className="edu__right-container justify-center">
        <div className="p4">
          <NoData />
        </div>
      </div>
    );
  }

  const getPageTitle = item => {
    const str = " - Footprint";
    const title = item?.title || "";
    return title.endsWith(str)
      ? title.substring(title.length - str.length, -str.length)
      : title;
  };

  const formatItem = item => {
    if (item.model === "news") {
      return {
        ...item,
        name: item.title,
        mode: "activity",
        websiteUrl:
          item.url || articleDetailUrl({ ...item, mediaInfoId: item.id }),
        target: "_blank",
        mediaUrl: item.thumbnail,
      };
    }
    if (item.model === "gitbook") {
      return {
        ...item,
        name: getPageTitle(item),
        mode: "activity",
        websiteUrl: item.url,
        target: "_blank",
      };
    }
    return item;
  };
  const sections = groupBy(data?.data, "section");
  const showSection = every(Object.keys(sections), p => p !== "undefined");

  const formatSection = section => {
    return formatSectionTitle(section);
  };

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  if (showSection) {
    return (
      <ul className="edu__right-container">
        {Object.keys(sections)
          .sort()
          .map(section => {
            return (
              <li key={section}>
                <div className="edu__right-container-section">
                  <span>{formatSection(section)}</span>
                </div>
                <ul className="edu__right-container-section-content">
                  {sections[section]
                    .filter(item => {
                      const pathArray = item.url.split("/");
                      return pathArray[pathArray.length - 1] !== section;
                    })
                    .map((item, index) => {
                      return (
                        <li className="edu__right-box-item" key={index}>
                          <Item item={formatItem(item)} />
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
      </ul>
    );
  }
  return (
    <div className="edu__right">
      <ul className="edu__right-container">
        {data?.data?.map((item, index) => {
          return (
            <li className="edu__right-box-item" key={index}>
              <Item item={formatItem(item)} showStat={false} />
            </li>
          );
        })}
      </ul>
      {data?.total && (
        <Pagination
          className="edu__right-pagination"
          hideOnSinglePage
          {...pagination}
        />
      )}
    </div>
  );
};

export default Content;
