import { useEffect, useState } from "react";
import { getFavorite, getMyAnalytics } from "metabase/new-service";

export const useSort = () => {
  const [sortList, setSortList] = useState([
    {
      name: "date",
      sort: "desc",
      svgDown: "sort_down",
      svgUp: "sort_up",
      selected: true,
    },
  ]);

  return {
    sortList,
    setSortList,
    currentSort: sortList.find(f => f.selected),
  };
};

export const useGetCategory = ({ location }) => {
  const [categoryList, setCategoryList] = useState(() => {
    const res = [
      {
        label: "My Creations",
        value: "all",
        selected: true,
        withTag: true,
        sortMap: {
          date: "created_at",
        },
      },
      {
        label: "Favorites",
        value: "favorites",
        selected: false,
        withTag: true,
        getFavoriteModel: currentTag => {
          if (
            currentTag.valueX === "dashboard" &&
            currentTag.valueY === "dashboard"
          ) {
            return "dashboard";
          } else if (
            currentTag.valueX === "card" &&
            currentTag.valueY === "card"
          ) {
            return "card";
          }
          return null;
        },
        sortMap: {
          date: "views",
        },
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

export const useGetTag = ({ currentCategory }) => {
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    const _getTag = async () => {
      if (currentCategory.withTag) {
        if (tagList.length === 0) {
          setTagList([
            {
              title: "All",
              tag: "All",
              valueX: "dashboard",
              valueY: "card",
              selected: true,
            },
            {
              title: "Dashboard",
              tag: "Dashboard",
              valueX: "dashboard",
              valueY: "dashboard",
            },
            {
              title: "Chart",
              tag: "Query",
              valueX: "card",
              valueY: "card",
            },
          ]);
        }
      } else {
        setTagList([]);
      }
    };
    _getTag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory.value]);

  return {
    tagList,
    setTagList,
    currentTag: tagList && tagList.find(f => f.selected),
  };
};

export const useGetMyInfo = ({
  currentCategory,
  currentPage,
  collectionId,
  currentTag,
  currentSort,
  user,
}) => {
  const [myList, setMyList] = useState([]);
  const [myTotal, setMyTotal] = useState();

  useEffect(() => {
    if (!currentCategory || !collectionId) {
      return;
    }
    if (currentCategory.withTag && !currentTag) {
      return;
    }
    if (!currentCategory.withTag && currentTag) {
      return;
    }

    // history.replaceState(
    //   null,
    //   document.title,
    //   `/mine?category=${currentCategory.value}`,
    // );

    const _getInfo = async () => {
      let res;
      const sortColumn = currentCategory.sortMap[currentSort.name];
      if (currentCategory.value === "all") {
        res = await getMyAnalytics({
          valueX: currentTag.valueX,
          valueY: currentTag.valueY,
          params: {
            name: user.name,
            pageSize: 40,
            current: currentPage,
            pinnedState: currentCategory.value,
            sortBy: sortColumn,
            sortDirection: currentSort.sort,
          },
        });
      } else {
        const model = currentCategory.getFavoriteModel
          ? currentCategory.getFavoriteModel(currentTag)
          : null;
        res = await getFavorite({
          collectionId,
          params: {
            pageSize: 40,
            current: currentPage,
            sortColumn: sortColumn,
            sortDirection: currentSort.sort,
            model: model,
          },
        });
      }
      setMyList(value => [...value, ...res.data]);
      setMyTotal(res.total);
    };

    _getInfo();
  }, [
    currentCategory,
    collectionId,
    currentPage,
    currentTag,
    currentSort,
    user.name,
  ]);

  return { myList, setMyList, myTotal, setMyTotal };
};
