import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import { useQuery } from "react-query";
import {
  fetchHomeNewNews,
  elasticSearch,
  brandPageIndicator,
} from "metabase/new-service";
import { QUERY_OPTIONS } from "./config";
import dayjs from "dayjs";
import { articleDetailUrl } from "metabase/lib/urls";
import { formatTitle } from "metabase/lib/formatting";
import * as Urls from "metabase/lib/urls";
import { ossPath } from "metabase/lib/ossPath";
import { isProduction } from "metabase/env";
import { uniqBy } from "lodash";

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
  const indicatorTestData = {
    chains: 134,
    chainsParsed: 17,
    protocols: 6070,
    gamefiChains: 42,
    gamefiProtocols: 1696,
    gamefiParsedChains: 13,
    gamefiParsedProtocols: 1364,
    nftChains: 11,
    nftCollections: 126551,
    nftParsedChains: 3,
    nftParsedMarketplaces: 11,
    defiProtocols: 1599,
    tokens: 108341,
    tags: 27922187,
    dashboards: 5212,
    charts: 25806,
  };
  const indicator = isProduction ? queryIndicator?.data : indicatorTestData;

  return { indicator, isLoading: queryIndicator.isLoading };
};
