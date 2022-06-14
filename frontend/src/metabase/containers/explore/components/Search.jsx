/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { Input, AutoComplete } from "antd";
import { t } from "ttag";
import Button from "metabase/components/Button";
import { searchTags } from "metabase/new-service";
import { debounce } from "lodash";
import { trackStructEvent } from "metabase/lib/analytics";

const Search = ({ currentTag, onTagSearch }) => {
  const tagListApi = async query => {
    return await searchTags({ q: query });
  };

  const searchResult = async query => {
    if (!query || query.length === 0) {
      return;
    }
    const tagDataObject = await tagListApi(query);
    return tagDataObject.map(value => {
      return {
        value: `${value}`,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{value}</span>
          </div>
        ),
      };
    });
  };

  const [options, setOptions] = useState([]);
  const [tagValue, setTagValue] = useState();

  useEffect(() => {
    if (currentTag) {
      setTagValue(currentTag.tag || "");
    }
  }, [currentTag]);

  const handleSearch = async value => {
    const tagDataObject = await searchResult(value);
    setOptions(value ? tagDataObject : []);
  };

  const handleChange = value => {
    setTagValue(value);
  };

  const onSelect = value => {
    trackStructEvent(`tag-search-accurate-select,${value}`);
    onTagSearch && onTagSearch(value, "accurate");
  };

  const searchOnClick = () => {
    trackStructEvent(`tag-search-accurate-click,${tagValue}`);
    onTagSearch && onTagSearch(tagValue, "accurate");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(value => handleSearch(value), 500),
    [],
  );

  return (
    <div className="explore__search">
      <div className="flex">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          allowClear
          style={{
            width: 252,
          }}
          value={tagValue}
          options={options}
          onSelect={onSelect}
          onSearch={debouncedSearch}
          onChange={handleChange}
        >
          <Input
            size="large"
            value={tagValue}
            placeholder="input tag"
            style={{ borderRadius: 4 }}
          />
        </AutoComplete>
        <Button
          className="explore__search-button"
          primary
          onClick={searchOnClick}
        >
          {t`Search`}
        </Button>
      </div>
    </div>
  );
};

export default Search;
