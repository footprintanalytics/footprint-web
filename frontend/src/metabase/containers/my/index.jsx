/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import Category from "metabase/containers/explore/components/Category";
import { useGetCategory, useGetMyInfo, useGetTag, useSort } from "./use";
import List from "metabase/containers/explore/components/List";
import "../explore/index.css";
import "./index.css";
import Tag from "metabase/containers/my/components/Tag";
import { trackStructEvent } from "../../lib/analytics";
import Sort from "metabase/containers/my/components/Sort";
import { getProject } from "metabase/lib/project_info";
import { getPersonalCollectionId } from "metabase/lib/collection";

const Index = ({ user, children, location }) => {
  const project = getProject();

  const [currentPage, setCurrentPage] = useState(1);

  const { categoryList, setCategoryList, currentCategory } = useGetCategory({
    location,
  });
  const { tagList, setTagList, currentTag } = useGetTag({
    currentCategory,
  });
  const { sortList, setSortList, currentSort } = useSort();
  const { myList, setMyList, myTotal, setMyTotal } = useGetMyInfo({
    currentCategory,
    currentPage,
    currentTag,
    collectionId: getPersonalCollectionId(user),
    currentSort,
  });

  const onCategoryClick = item => {
    trackStructEvent("click MyAnalytics Category " + item.label);
    setCurrentPage(1);
    setMyList([]);
    setMyTotal(undefined);
    setCategoryList(value =>
      value.map(v => ({
        ...v,
        selected: item.label === v.label,
      })),
    );
  };

  const onTagClick = item => {
    trackStructEvent("click MyAnalytics Tag " + item.tag);
    setCurrentPage(1);
    setMyList([]);
    setMyTotal(undefined);
    setTagList(value =>
      value.map(v => ({
        ...v,
        selected: item.tag === v.tag,
      })),
    );
  };

  const onAfterChangePublicUuid = ({ newUuid, id, type }) => {
    if (currentCategory.value === "all") {
      myList
        .filter(item => item.id === id && item.type === type)
        .map(item => {
          item.publicUuid = newUuid;
          return item;
        });
    } else {
      if (!newUuid) {
        setMyList(myList.filter(item => item.id !== id || item.type !== type));
      }
    }
  };

  const favoriteClickSuccess = ({ id, type, favorite }) => {
    if (currentCategory.value !== "all") {
      if (!favorite) {
        setMyList(myList.filter(item => item.id !== id || item.type !== type));
      }
    }
  };

  const archiveSuccess = ({ id, type }) => {
    setMyList(myList.filter(item => item.id !== id || item.type !== type));
  };

  const onSortClick = item => {
    setCurrentPage(1);
    setMyList([]);
    setMyTotal(undefined);
    setSortList(
      sortList.map(v => ({
        ...v,
        sort:
          v.name === item.name ? (v.sort === "desc" ? "asc" : "desc") : v.sort,
      })),
    );
  };

  return (
    <div className="mine bg-gray">
      {project !== "defi360" && (
        <Category
          categoryList={categoryList}
          onCategoryClick={onCategoryClick}
        />
      )}
      <div className="mine__wrap">
        <Tag
          currentCategory={currentCategory}
          tagList={tagList}
          onTagClick={onTagClick}
          tagRightPanel={<Sort items={sortList} onSortClick={onSortClick} />}
        />
        <List
          location={location}
          exploreList={myList}
          exploreTotal={myTotal}
          createPanel={true}
          showArchiveButton={currentCategory.value === "all"}
          onAfterChangePublicUuid={onAfterChangePublicUuid}
          favoriteClickSuccess={favoriteClickSuccess}
          archiveSuccess={archiveSuccess}
          loadMore={() => setCurrentPage(value => value + 1)}
        />
      </div>
      {children}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(Index);
