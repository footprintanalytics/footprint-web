import { useEffect, useState } from "react";
import { mediaList, tutorialsMenuDetail } from "metabase/new-service";
import { message } from "antd";
import { useQuery } from "react-query";
import {
  QUERY_OPTIONS_ARTICLE,
  QUERY_OPTIONS_NORMAL,
} from "metabase/containers/dashboards/shared/config";

export const useMediaList = ({ type, currentPage, user }) => {
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
          type: type,
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
    if (data) {
      const res = data;
      setMediaData(value => [...value, ...res.data]);
      setMediaTotal(res.total);
    }
  }, [data]);

  return { mediaData, setMediaData, mediaTotal, setMediaTotal, isLoading };
};
