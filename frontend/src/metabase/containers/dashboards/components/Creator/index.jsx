import React from "react";
// eslint-disable-next-line import/order
import { elasticSearch } from "metabase/new-service";
import { useQueries } from "react-query";
// eslint-disable-next-line import/order
import Link from "metabase/core/components/Link";
import "./index.css";
import { Avatar, Skeleton } from "antd";
import dayjs from "dayjs";
import { every } from "lodash";
import { trackStructEvent } from "metabase/lib/analytics";
import { QUERY_OPTIONS } from "../../shared/config";

const Creator = () => {
  const hotsData = [
    "Beosin",
    "kaixuan",
    "PrimoData",
    "0xLam",
    "1chioku",
    "Grim",
    "SIGMAStandard",
    "Hanson2",
    "planD",
    "sankin",
    "Coin360",
    "DeGame",
    "Cao",
    "Momo",
    "ABGAofficial",
    "EarnOnly",
    "Penspencap",
    "Victor",
    "BG",
    "cloudr3n",
    "rogerD",
    "DamonSalvatore",
    "u7tkguSKt2",
    "0x",
    "Amwal",
    "2H0j6vbqFL",
    "Momir597295",
  ];
  const maxNums = 50;
  const paramsHots = {
    sortDirection: "desc",
    sortBy: "dashboard_count",
    current: 1,
    pageSize: 100,
    model: "creator",
    qs: hotsData,
  };

  const params = {
    sortDirection: "desc",
    sortBy: "dashboard_count",
    current: 1,
    pageSize: 50,
    model: "creator",
    qs: [],
  };

  const results = useQueries(
    [
      {
        queryKey: ["elasticSearchHots", paramsHots],
        queryFn: async () => elasticSearch(paramsHots),
      },
      {
        queryKey: ["elasticSearch", params],
        queryFn: async () => elasticSearch(params),
      },
    ],
    QUERY_OPTIONS,
  );

  const getData = results => {
    if (results.length < 2) {
      return [];
    }
    //1.hot, 2.dashboard count sort
    return [
      ...(hotsData
        ?.map(item => results[0]?.data?.data?.find(d => d?.user_name === item))
        ?.filter(item => item) || []),
      ...(results[1]?.data?.data?.filter(
        item => !hotsData.includes(item?.user_name),
      ) || []),
    ].slice(0, maxNums);
  };

  const isLoading = every(results, ["isLoading", true]);

  return (
    <div className="dashboards__creator">
      <div className="dashboards__area">
        <Link
          href="/search?q=&model=creator"
          onClick={() => trackStructEvent("Dashboards Creator", "See all")}
        >
          <div className="dashboards__cell">
            <h2>Creator</h2>
            {">"}
          </div>
        </Link>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <ul className="dashboards__creator-list">
            {getData(results)?.map(item => (
              <li key={item.id}>
                <Link
                  to={`/@${item.user_name}`}
                  className="dashboards__creator-list-item"
                  onClick={() =>
                    trackStructEvent("Dashboards Creator", item.user_name)
                  }
                >
                  <div className="dashboards__creator-list-l">
                    {item.avatar ? (
                      <img
                        src={
                          item.avatar +
                          `?x-oss-process=image/resize,m_fill,h_120,w_120`
                        }
                      />
                    ) : (
                      <Avatar
                        size="small"
                        style={{ backgroundColor: "rgb(228, 228, 254)" }}
                      >
                        <span data-nosnippet>
                          {String(item.user_name[0]).toUpperCase()}
                        </span>
                      </Avatar>
                    )}
                    <div>
                      <h3>{item.user_name}</h3>
                      <time>
                        Created since{" "}
                        {dayjs(item.date_joined).format("MMM YYYY")}
                      </time>
                    </div>
                  </div>
                  <div className="dashboards__creator-list-r">
                    <span>{item.dashboard_count}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Creator;
