import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { mediaList, tutorialsMenuDetail } from "metabase/new-service";
import { QUERY_OPTIONS_ARTICLE } from "metabase/containers/dashboards/shared/config";

export const useMediaList = ({ type, tag, currentPage, sortBy, sortDirection, pageSize = 10 }) => {
  const [mediaData, setMediaData] = useState([]);
  const [mediaTotal, setMediaTotal] = useState(undefined);

  const params =
    type === "week-letter"
      ? {
          menu: "Reports",
          subMenu: "Weekly Reports",
          pageSize: pageSize,
          current: currentPage,
        }
      : {
          pageSize: pageSize,
          current: currentPage,
          type: tag ? null : type,
          tag,
          sortBy,
          sortDirection,
        };

  const { isLoading, data } = useQuery(
    ["mediaList", "tutorialsMenuDetail", params],
    async () => {
      if (type === "week-letter") {
        return tutorialsMenuDetail(params);
      }
      return mediaList(params);
    },
    QUERY_OPTIONS_ARTICLE,
  );

  useEffect(() => {
    if (type !== "realTimeInfo") {
      setMediaData([]);
      setMediaTotal(0);
    }
  }, [tag, type]);

  useEffect(() => {
    if (data) {
      const res = data;
      setMediaData(value => [...value, ...res.data]);
      setMediaTotal(res.total);
    }
  }, [data]);

  return { mediaData, setMediaData, mediaTotal, setMediaTotal, isLoading };
};
