/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { useGetCategory, useGetExplore, useGetTag } from "./use";
import List from "./components/List";
import connect from "react-redux/lib/connect/connect";
import { getUser } from "metabase/selectors/user";
import Tag from "metabase/containers/explore/components/Tag";
// import KeepAliveControls from "metabase/hoc/KeepAliveControls";
import { parseHashOptions } from "metabase/lib/browser";
import Meta from "metabase/components/Meta";

function Explore({ location, user, q, children, hideSearch }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [noSearch, setNoSearch] = useState(false);

  const { currentCategory } = useGetCategory({
    location,
  });

  const { currentTag, setCurrentTag, tagList, setTagList } = useGetTag({
    currentCategory,
    q,
  });

  const { exploreTotal, exploreList, setExploreList } = useGetExplore({
    currentCategory,
    currentPage,
    currentTag,
    user,
  });

  useEffect(() => {
    if (hideSearch) {
      setNoSearch(true);
      return;
    }

    const _handleHash = () => {
      const { no_search } = {
        ...parseHashOptions(window.location.hash),
      };
      setNoSearch(no_search);
    };
    window.onhashchange = () => {
      _handleHash();
    };
    _handleHash();
  }, [hideSearch]);

  const onTagClick = item => {
    setCurrentPage(1);
    setExploreList([]);
    if (item.selected) {
      setTagList(value =>
        value.map(v => ({
          ...v,
          selected: false,
        })),
      );
      setCurrentTag({});
    } else {
      setTagList(value =>
        value.map(v => ({
          ...v,
          selected: item.tag === v.tag,
        })),
      );
      setCurrentTag({ ...item, selected: true });
    }
  };

  const onTagSearch = (tag, type) => {
    setCurrentPage(1);
    setExploreList([]);
    setTagList(value =>
      value.map(v => ({
        ...v,
        selected: false,
      })),
    );
    setCurrentTag({ tag, type, selected: true });
  };

  const onAfterChangePublicUuid = ({ newUuid, id, type }) => {
    if (!newUuid) {
      setExploreList(
        exploreList.filter(item => item.id !== id || item.type !== type),
      );
    }
  };

  return (
    <>
      <Meta
        keywords={tagList.map(item => item.tag).join(", ")}
        description={currentTag.tag}
      />
      <div className="explore bg-gray">
        <div className="explore__wrap">
          {!noSearch && (
            <Tag
              currentCategory={currentCategory}
              tagList={tagList}
              currentTag={currentTag}
              onTagClick={onTagClick}
              onTagSearch={onTagSearch}
            />
          )}

          <List
            location={location}
            exploreList={exploreList}
            exploreTotal={exploreTotal}
            createPanel={true}
            type="explore"
            onAfterChangePublicUuid={onAfterChangePublicUuid}
            loadMore={() => setCurrentPage(value => value + 1)}
          />
          {children}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
    q: props.q || props.location.query.q,
  };
};

// export default KeepAliveControls("explore")(connect(mapStateToProps)(Explore));
export default connect(mapStateToProps)(Explore);
export const ExploreNoCache = connect(mapStateToProps)(Explore);
