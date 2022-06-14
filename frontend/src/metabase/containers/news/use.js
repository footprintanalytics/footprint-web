import { useEffect, useState } from "react";
import { mediaList } from "metabase/new-service";
import { message } from "antd";

export const useMediaList = ({ type, currentPage, user }) => {
  const [mediaData, setMediaData] = useState([]);
  const [mediaTotal, setMediaTotal] = useState(undefined);

  const userId = user && user.id;

  useEffect(() => {
    const _getMediaList = async () => {
      const params = {
        pageSize: 10,
        current: currentPage,
        type: type,
      };
      let hide;
      if (currentPage === 1) {
        hide = message.loading("Loading...");
      }
      try {
        const res = await mediaList(params);
        setMediaData(value => [...value, ...res.data]);
        setMediaTotal(res.total);
      } catch (e) {
      } finally {
        hide && hide();
      }
    };

    _getMediaList();
  }, [currentPage, type, userId]);

  return { mediaData, setMediaData, mediaTotal, setMediaTotal };
};
