import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import moment from "moment";
import Icon from "metabase/components/Icon";
import EmptyState from "metabase/components/EmptyState";
import { searchCards } from "metabase/new-service";
import { EmptyStateContainer } from "./QuestionList.styled";
import { getProject } from "metabase/lib/project_info";
import * as Urls from "metabase/lib/urls";
import { message, Skeleton } from "antd";
import "./QuestionPickerNew.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "metabase/components/Link";
import { formatTitle, formatUrlIfDefi } from "metabase/lib/formatting";

QuestionListNew.propTypes = {
  searchText: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  sortOption: PropTypes.object,
};

export function QuestionListNew({ searchText, sortOption, onSelect }) {
  const pageLimit = 20;
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [requestParam, setRequestParam] = useState();
  const [height, setHeight] = useState();
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current?.getBoundingClientRect().top);
  }, []);
  const loadMore = () => {
    if (loadingMore) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (!requestParam) {
      return;
    }
    const parms = { ...requestParam };
    parms.current = currentPage;
    setRequestParam(parms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    let parms = {
      project: getProject(),
      type: sortOption.type,
      sortBy: sortOption.sort.key,
      sortDirection: sortOption.sort.isUp ? "asc" : "desc",
      current: 1,
      pageSize: pageLimit,
    };
    if (searchText) {
      parms = { ...parms, keyword: searchText?.trim() };
    }
    if (parms.sortBy) {
      setRequestParam(parms);
    }
  }, [searchText, sortOption]);
  useEffect(() => {
    if (requestParam) {
      toSearch(requestParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestParam]);

  const toSearch = async param => {
    param.current > 1 ? setLoadingMore(true) : setIsSearching(true);
    try {
      const searchRes = await searchCards(param);
      const { current, data, success, total } = searchRes;
      if (success) {
        if (current > 1) {
          setSearchResult([...searchResult, ...data]);
        } else {
          setSearchResult(data);
        }
        setCurrentPage(current);
        setTotal(total);
      } else {
        message.error("Searching error,please try again later!");
      }
    } catch (error) {
      message.error(
        "Searching error:" + (error.message ? message.message : error),
      );
    }
    param.current > 1 ? setLoadingMore(false) : setIsSearching(false);
  };

  return (
    <div ref={ref}>
      {isSearching ? (
        <Skeleton active={true}></Skeleton>
      ) : (
        <div
          className="flex flex-column SearchResult"
          id="scrollableDiv"
          style={height ? { height: `calc(100vh - ${height + 20}px)` } : {}}
        >
          {searchResult && (
            <InfiniteScroll
              dataLength={searchResult.length}
              next={loadMore}
              hasMore={searchResult.length < total}
              loader={
                <Skeleton className="mb1" paragraph={{ rows: 1 }} active />
              }
              endMessage={
                <div style={{ paddingRight: "5px" }}>
                  <Link
                    className=" rounded flex flex-row text-center align-center cursor-pointer"
                    href={formatUrlIfDefi(Urls.newQuestion())}
                    target="_blank"
                    style={{
                      backgroundColor: "#F6F6FE",
                      color: "#3434B2",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "600",
                      height: "48px",
                    }}
                  >
                    <span style={{ width: "100%", textAlign: "center" }}>
                      + Create my chart
                    </span>
                  </Link>
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {searchResult && searchResult.length === 0 && (
                <EmptyStateContainer>
                  <EmptyState message={t`Nothing here`} icon="all" />
                </EmptyStateContainer>
              )}
              {searchResult &&
                searchResult.map(item => {
                  const { id, name, creatorName, createdAt, display } = item; //views
                  return (
                    <div
                      className="flex flex-row rounded cursor-pointer SearchResultItem"
                      key={id}
                      onClick={() => {
                        onSelect(id);
                      }}
                    >
                      <Icon
                        name={display ? display : "search_dashboard"}
                        size={18}
                      />
                      <div
                        className="flex flex-column ml1 mr1"
                        style={{ flex: 1 }}
                      >
                        <div
                          className=" text-ellipsis"
                          style={{ fontSize: "14px" }}
                        >
                          {formatTitle(name)}
                        </div>
                        <div className=" footprint-secondary-text2">
                          {creatorName}
                          {" • "}
                          {moment(createdAt).format("YYYY-MM-DD")}
                        </div>
                      </div>
                      <div className="flex flex-row align-center SearchResultItem_Add">
                        <Icon name={"add"} size={12} /> Add
                      </div>
                    </div>
                  );
                })}
            </InfiniteScroll>
          )}
        </div>
      )}
    </div>
  );
}
