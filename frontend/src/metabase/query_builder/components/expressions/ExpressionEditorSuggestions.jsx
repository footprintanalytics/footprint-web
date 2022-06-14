import React from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import cx from "classnames";

import Popover from "metabase/components/Popover";
import {
  ListItemStyled,
  SectionTitle,
  UlStyled,
} from "./ExpressionEditorSuggestions.styled";

import { isObscured } from "metabase/lib/dom";

import { FunctionOutlined, BorderlessTableOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import getHelpText from "metabase/lib/expressions/helper_text_strings";

const SUGGESTION_SECTION_NAMES = {
  fields: t`Fields`,
  aggregations: t`Aggregations`,
  operators: t`Operators`,
  metrics: t`Metrics`,
  other: "Other",
};

const SuggestionSpan = ({ suggestion, isHighlighted }) => {
  const className = cx("text-brand text-bold hover-child", {
    "text-white bg-brand": isHighlighted,
  });

  return suggestion.range ? (
    <span>
      {suggestion.name.slice(0, suggestion.range[0])}
      <span className={className}>
        {suggestion.name.slice(suggestion.range[0], suggestion.range[1])}
      </span>
      {suggestion.name.slice(suggestion.range[1])}
    </span>
  ) : (
    suggestion.name
  );
};

SuggestionSpan.propTypes = {
  suggestion: PropTypes.object,
  isHighlighted: PropTypes.bool,
};

export default class ExpressionEditorSuggestions extends React.Component {
  static propTypes = {
    suggestions: PropTypes.array,
    onSuggestionMouseDown: PropTypes.func, // signature is f(index)
    highlightedIndex: PropTypes.number.isRequired,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps && prevProps.highlightedIndex) !== this.props.highlightedIndex
    ) {
      if (this._selectedRow && isObscured(this._selectedRow)) {
        this._selectedRow.scrollIntoView({ block: "nearest" });
      }
    }
  }

  // when a given suggestion is clicked
  onSuggestionMouseDown(event, index) {
    event.preventDefault();
    event.stopPropagation();

    this.props.onSuggestionMouseDown && this.props.onSuggestionMouseDown(index);
  }

  render() {
    const { suggestions, highlightedIndex } = this.props;

    if (!suggestions.length) {
      return null;
    }

    return (
      <Popover
        className="not-rounded border-dark"
        hasArrow={false}
        tetherOptions={{
          attachment: "top left",
          targetAttachment: "bottom left",
        }}
        sizeToFit
      >
        <UlStyled>
          {suggestions.map((suggestion, i) => {
            const shouldRenderSectionTitle =
              i === 0 || suggestion.type !== suggestions[i - 1].type;

            const sectionTitle =
              SUGGESTION_SECTION_NAMES[suggestion.type] || suggestion.type;

            const isHighlighted = i === highlightedIndex;

            const helpText = getHelpText(suggestion.name);

            return (
              <React.Fragment key={`suggestion-${i}`}>
                {shouldRenderSectionTitle && (
                  <SectionTitle>{sectionTitle}</SectionTitle>
                )}
                <Tooltip
                  placement="left"
                  title={
                    suggestion.type === "functions"
                      ? helpText?.description
                      : undefined
                  }
                >
                  <ListItemStyled
                    onMouseDownCapture={e => this.onSuggestionMouseDown(e, i)}
                    isHighlighted={isHighlighted}
                  >
                    {suggestion.type === "functions" && (
                      <FunctionOutlined style={{ marginRight: 4 }} />
                    )}
                    {suggestion.type === "fields" && (
                      <BorderlessTableOutlined style={{ marginRight: 4 }} />
                    )}
                    <SuggestionSpan
                      suggestion={suggestion}
                      isHighlighted={isHighlighted}
                    />
                  </ListItemStyled>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </UlStyled>
      </Popover>
    );
  }
}
