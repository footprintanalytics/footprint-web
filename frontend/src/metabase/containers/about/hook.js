import "./index.css";
import { useQuery } from "react-query";
import { uniqBy } from "lodash";
import dayjs from "dayjs";
import { getOssUrl } from "metabase/lib/image";
import { brandPageIndicator, elasticSearch, fetchHomeNewNews } from "metabase/new-service";
import { isProduction } from "metabase/env";
import { formatTitle } from "metabase/lib/formatting";
import * as Urls from "metabase/lib/urls";
import { articleDetailUrl } from "metabase/lib/urls";
import { ossPath } from "metabase/lib/ossPath";
import { QUERY_OPTIONS } from "./config";

export const useQueryDashboard = ({ query }) => {
  const queryDashboard = useQuery(
    ["dashboard", query],
    async () =>
      elasticSearch({
        category: "All",
        current: 1,
        isSort: false,
        model: "dashboard",
        pageSize: 10,
        project: "footprint",
        qs: query,
        sortBy: "views",
        sortDirection: "desc",
        tags: [],
      }),
    QUERY_OPTIONS,
  );

  let dashboard = queryDashboard?.data?.data?.map(item => ({
    title: formatTitle(item.name),
    url: Urls.dashboard(item),
    img: isProduction
      ? getOssUrl(ossPath(`dashboard/${item.id}.png`))
      : "https://static.footprint.network/dashboard/4010.png",
    date: dayjs(item.createdAt).format("YYYY-MM-DD"),
  }));
  dashboard = uniqBy(dashboard, "title").slice(0, 6);

  return { dashboard, isLoading: queryDashboard.isLoading };
};

export const useQueryNews = () => {
  const queryNews = useQuery("news", fetchHomeNewNews, QUERY_OPTIONS);

  const news = queryNews?.data?.news?.slice(0, 3)?.map(item => ({
    title: item.title,
    url: articleDetailUrl(item),
    img: item.thumbnail,
    date: dayjs(item.publishTime).format("YYYY-MM-DD"),
  }));

  return { news, isLoading: queryNews.isLoading };
};

export const useQueryIndicator = () => {
  const queryIndicator = useQuery(
    "indicator",
    brandPageIndicator,
    QUERY_OPTIONS,
  );
  const indicator = queryIndicator?.data;
  return { indicator, isLoading: queryIndicator.isLoading };
};
