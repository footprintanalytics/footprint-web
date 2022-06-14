/* eslint-disable react/display-name */
import Link from "metabase/components/Link";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import Highlighter from "react-highlight-words";
import { getSearchTexts } from "metabase/nav/components/utils";
import { Avatar } from "antd";

export default ({ router }) => {
  const query = router?.location?.query;
  const qs = getSearchTexts(router.location.query.q);
  const getUrl = item => {
    return `/@${item.user_name}`;
  };
  const name = {
    title: "Name",
    key: "name",
    dataIndex: "name",
    width: 400,
    render: (_, record) => {
      return (
        <Link
          onClick={() => trackStructEvent("Protocols Name", record.name)}
          className="protocols__table-name"
          to={getUrl(record)}
          target="_blank"
        >
          {record.avatar ? (
            <img
              src={
                record.avatar + "?x-oss-process=image/resize,m_fill,h_120,w_120"
              }
            />
          ) : (
            <Avatar
              size="small"
              style={{ backgroundColor: "rgb(228, 228, 254)" }}
            >
              <span data-nosnippet>
                {String(record.user_name[0]).toUpperCase()}
              </span>
            </Avatar>
          )}
          <Highlighter
            highlightClassName="highlight"
            searchWords={qs}
            autoEscape={true}
            textToHighlight={record.user_name}
          />
        </Link>
      );
    },
  };
  const dashboardCount = {
    title: "Dashboard",
    key: "dashboard_count",
    dataIndex: "dashboard_count",
    width: 400,
    sorter: true,
    sortDirections: ["descend", "ascend", "descend"],
    sortOrder:
      !query?.sortBy || query?.sortBy === "dashboard_count"
        ? sortMap[query?.sortDirection] || sortMap.desc
        : undefined,
    render: dashboardCount => {
      return <div>{dashboardCount}</div>;
    },
  };
  const cardCount = {
    title: "Chart",
    key: "card_count",
    dataIndex: "card_count",
    width: 400,
    sorter: true,
    sortDirections: ["descend", "ascend", "descend"],
    sortOrder:
      query?.sortBy === "card_count"
        ? sortMap[query?.sortDirection] || sortMap.desc
        : undefined,
    render: cardCount => {
      return <div>{cardCount}</div>;
    },
  };
  return [name, dashboardCount, cardCount];
};
