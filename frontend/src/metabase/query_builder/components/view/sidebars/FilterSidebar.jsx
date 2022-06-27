/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import cx from "classnames";

import SidebarContent from "metabase/query_builder/components/SidebarContent";
import FilterPopover from "metabase/query_builder/components/filters/FilterPopover";

import { color } from "metabase/lib/colors";
import { closeNewGuide } from "metabase/containers/newguide/newGuide";

/** FilterSidebar operates on filters from topLevelFilters */
export default class FilterSidebar extends React.Component {
  state = {
    filter: null,
  };

  handleCommit(filter) {
    if (filter && filter.isValid()) {
      closeNewGuide({ key: "filterFieldValueConfirm" });
      filter.add().update(null);
    }
    this.props.onClose();
  }

  render() {
    const {
      className,
      question,
      onClose,
      getNewGuideInfo,
      setNewGuideInfo,
      optionDefaultFirstKey,
    } = this.props;
    const { filter } = this.state;
    const valid = filter && filter.isValid();
    return (
      <SidebarContent
        className={cx(className, "spread", "filterSidebar")}
        color={color("filter")}
        onDone={valid ? () => this.handleCommit(filter) : onClose}
        doneButtonText={valid ? t`Add filter` : t`Cancel`}
      >
        <FilterPopover
          isTopLevel
          isSidebar
          className="mx2 pt1"
          fieldPickerTitle={t`Filter by`}
          query={question.query()}
          // fires every time the filter is changed:
          onChange={filter => this.setState({ filter })}
          // fires when a segment or "add" button is clicked:
          onChangeFilter={filter => this.handleCommit(filter)}
          noCommitButton
          getNewGuideInfo={getNewGuideInfo}
          setNewGuideInfo={setNewGuideInfo}
          optionDefaultFirstKey={optionDefaultFirstKey}
        />
      </SidebarContent>
    );
  }
}
