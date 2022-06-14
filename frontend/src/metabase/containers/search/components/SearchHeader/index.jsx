/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
import { useDebounce } from "ahooks";
import { getSearchQueryLink } from "../../shared/utils";
import Icon from "metabase/components/Icon";

const SearchHeader = ({ router }) => {
  const [searchText, setSearchText] = useState();
  const debouncedSearchText = useDebounce(searchText, { wait: 500 });

  useEffect(() => {
    setSearchText(router.location.query.q);
  }, [router.location.query.q]);

  useEffect(() => {
    if (debouncedSearchText !== undefined) {
      const link = getSearchQueryLink({
        ...router.location.query,
        q: debouncedSearchText,
      });
      router.replace(link);
    }
  }, [debouncedSearchText]);

  return (
    <div className="search__header">
      <div className="search__wrap search__header-wrap">
        <Input
          prefix={<Icon name="search" />}
          className="search__header-input"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          size="large"
          allowClear
        />
      </div>
    </div>
  );
};

export default SearchHeader;
