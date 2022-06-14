import { useEffect, useState } from "react";
import { exploreByTags, searchTags } from "metabase/new-service";
import { uniqBy } from "lodash";
import { message } from "antd";
import { browserHistory } from "react-router";
import querystring from "querystring";

export const useGetCategory = ({ location }) => {
  const [categoryList, setCategoryList] = useState(() => {
    const res = [
      {
        label: "Explore All",
        value: "exploreAll",
        selected: false,
        title: "All users dashboard and chart.",
        desc: `You can also create your personalized dashboard.`,
      },
    ];

    if (!location.query.category) {
      res[0].selected = true;
    } else {
      res.forEach(item => {
        item.selected = location.query.category === item.value;
      });
    }

    return res;
  });

  return {
    categoryList,
    setCategoryList,
    currentCategory: categoryList.find(f => f.selected),
  };
};

const getTags = async () => {
  const data = await searchTags();
  return data.map(value => {
    return { tag: value, type: "accurate" };
  });
};

export const useGetTag = ({ currentCategory, q }) => {
  const [tagList, setTagList] = useState([]);
  const [currentTag, setCurrentTag] = useState({ tag: q, type: "accurate" });

  useEffect(() => {
    const _getTag = async () => {
      const res = await getTags();
      const tag = res.map(item => ({
        ...item,
        selected: false,
      }));
      setTagList(tag);
    };

    _getTag();
  }, [currentCategory.value]);

  return {
    tagList,
    setTagList,
    currentTag,
    setCurrentTag,
  };
};

export const useGetExplore = ({
  currentCategory,
  currentPage,
  currentTag,
  user,
}) => {
  const [exploreList, setExploreList] = useState([]);
  const [exploreTotal, setExploreTotal] = useState();

  const userId = user && user.id;

  useEffect(() => {
    if (!currentCategory) {
      return;
    }

    const _getExplore = async () => {
      const params = {
        pageSize: 40,
        current: currentPage,
        category: currentCategory.value,
      };
      let hide;
      if (currentPage === 1) {
        hide = message.loading("Loading...");
      }
      if (currentTag.tag) {
        Object.assign(params, { q: currentTag.tag });
        Object.assign(params, { tags: [currentTag.tag] });
      }
      const res = await exploreByTags(params);
      hide && hide();
      setExploreList(value => {
        return uniqBy([...value, ...res.data], "publicUuid");
      });
      setExploreTotal(res.total);
    };

    _getExplore();
  }, [currentCategory, currentPage, currentTag, userId]);

  useEffect(() => {
    const _replaceQuery = () => {
      const currentLocation =
        browserHistory && browserHistory.getCurrentLocation();
      if (!currentLocation) {
        return;
      }
      const query = currentLocation.query;
      const hash = currentLocation.hash;
      let search = currentLocation.search;
      if (currentTag && currentTag.tag) {
        search = `?${querystring.stringify({ ...query, q: currentTag.tag })}`;
      } else if (query && "q" in query) {
        delete query["q"];
        const queryStr = querystring.stringify(query);
        search = queryStr.length > 0 ? `?${queryStr}` : "";
      }
      history &&
        history.replaceState(
          null,
          document.title,
          `${currentLocation.pathname}${search}${hash}`,
        );
    };
    _replaceQuery();
  }, [currentTag]);

  return { exploreTotal, exploreList, setExploreList, setExploreTotal };
};
