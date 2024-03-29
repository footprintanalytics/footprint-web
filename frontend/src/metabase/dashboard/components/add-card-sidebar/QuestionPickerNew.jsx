import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { connect } from "react-redux";
import { t } from "ttag";
import { Tabs } from "antd";
import { getUserIsAdmin } from "metabase/selectors/user";
import Icon from "metabase/components/Icon";
import { entityListLoader } from "metabase/entities/containers/EntityListLoader";
import Collections from "metabase/entities/collections";
import { useDebouncedValue } from "metabase/hooks/use-debounced-value";

import { SEARCH_DEBOUNCE_DURATION } from "metabase/lib/constants";
import { SearchInput } from "./QuestionPicker.styled";
import "./QuestionPickerNew.css";
import { SortButtons } from "./SortButtons";
import { QuestionListNew } from "./QuestionListNew";
const { TabPane } = Tabs;

QuestionPickerNew.propTypes = {
  onSelect: PropTypes.func.isRequired,
  collectionsById: PropTypes.object,
  getCollectionIcon: PropTypes.func,
  isAdmin: PropTypes.bool,
  initialCollection: PropTypes.number,
};

function QuestionPickerNew({ onSelect, isAdmin }) {
  const typeOptions = [
    // { name: "All", key: "all" },
    { name: "My charts", key: "mine" },
    { name: "Community charts", key: "community" },
  ];
  const [searchText, setSearchText] = useState("");

  const [currentTab, setCurrentTab] = useState(typeOptions[0].key);
  const [searchSort, setSearchSort] = useState({
    type: "",
    sort: {},
  });
  const debouncedSearchText = useDebouncedValue(
    searchText,
    SEARCH_DEBOUNCE_DURATION,
  );

  const handleSearchTextChange = value => setSearchText(value);

  return (
    <div className="question-picker-new p1">
      <SearchInput
        autoFocus
        hasClearButton
        placeholder={t`Search chart by name or chart's URL`}
        value={searchText}
        onChange={handleSearchTextChange}
        icon={<Icon name="search" size={16} />}
      />

      <Tabs
        defaultActiveKey={typeOptions[0].key}
        style={{ marginTop: "10px" }}
        onChange={key => {
          setCurrentTab(key);
        }}
      >
        {typeOptions.map(type => {
          return <TabPane tab={type.name} key={type.key} />;
        })}
      </Tabs>

      <SortButtons
        currentTab={currentTab}
        onSelect={item => {
          setSearchSort(item);
        }}
      />
      <QuestionListNew
        searchText={debouncedSearchText}
        sortOption={searchSort}
        onSelect={onSelect}
      />
    </div>
  );
}

export default _.compose(
  entityListLoader({
    entityType: "collections",
    loadingAndErrorWrapper: false,
  }),
  connect((state, props) => ({
    isAdmin: getUserIsAdmin(state, props),
    collectionsById: (
      props.entity || Collections
    ).selectors.getExpandedCollectionsById(state),
    getCollectionIcon: (props.entity || Collections).objectSelectors.getIcon,
  })),
)(QuestionPickerNew);
