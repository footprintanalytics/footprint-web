import { useEffect, useState } from "react";
import { mediaList, tutorialsMenuDetail } from "metabase/new-service";
import { useQuery } from "react-query";
import { QUERY_OPTIONS_ARTICLE } from "metabase/containers/dashboards/shared/config";

export const useMediaList = ({ type, tag, currentPage }) => {
  const [mediaData, setMediaData] = useState([]);
  const [mediaTotal, setMediaTotal] = useState(undefined);

  const params =
    type === "week-letter"
      ? {
          menu: "Reports",
          subMenu: "Weekly Reports",
          pageSize: 10,
          current: currentPage,
        }
      : {
          pageSize: 10,
          current: currentPage,
          type: tag ? null : type,
          tag,
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

  console.log("data", data);

  useEffect(() => {
    setMediaData([]);
    setMediaTotal(0);
  }, [tag]);

  useEffect(() => {
    if (data) {
      const res = data;
      setMediaData(value => [...value, ...res.data]);
      setMediaTotal(res.total);
    }
  }, [data]);

  return { mediaData, setMediaData, mediaTotal, setMediaTotal, isLoading };
};
