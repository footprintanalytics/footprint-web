import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { t } from "ttag";
import _ from "underscore";

import FieldValuesWidget from "metabase/components/FieldValuesWidget";
import ParameterFieldWidgetValue from "./ParameterFieldWidgetValue/ParameterFieldWidgetValue";
import Popover from "metabase/components/Popover";
import Button from "metabase/components/Button";

import { normalizeValue } from "./normalizeValue";

import cx from "classnames";
import {
  getFilterArgumentFormatOptions,
  isEqualsOperator,
  isFuzzyOperator,
} from "metabase/lib/schema_metadata";
import MetabaseUtils from "metabase/lib/utils";

const propTypes = {
  dashboard: PropTypes.object,
  fields: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  operator: PropTypes.object.isRequired,
  parameter: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  parentFocusChanged: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any,
  outerList: PropTypes.array, //series category list of outer
  children: PropTypes.any,
};

const BORDER_WIDTH = 1;

export default class ParameterFieldWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      value: props.value,
      widgetWidth: null,
    };
  }

  static noPopover = true;

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentDidUpdate() {
    const element = ReactDOM.findDOMNode(this._unfocusedElement);
    if (!this.state.isFocused && element) {
      const parameterWidgetElement = element.parentNode.parentNode.parentNode;
      if (parameterWidgetElement.clientWidth !== this.state.widgetWidth) {
        this.setState({ widgetWidth: parameterWidgetElement.clientWidth });
      }
    }
  }

  render() {
    const {
      setValue,
      isEditing,
      fields,
      parentFocusChanged,
      operator,
      parameter,
      parameters,
      dashboard,
      outerList,
      children,
    } = this.props;
    const { isFocused, widgetWidth } = this.state;
    const { numFields = 1, multi = false, verboseName } = operator || {};
    const savedValue = normalizeValue(this.props.value);
    const unsavedValue = normalizeValue(this.state.value);
    const isEqualsOp = isEqualsOperator(operator);
    const disableSearch = operator && isFuzzyOperator(operator);
    const defaultPlaceholder = isFocused
      ? ""
      : this.props.placeholder || t`Enter a value...`;

    const focusChanged = isFocused => {
      if (parentFocusChanged) {
        parentFocusChanged(isFocused);
      }
      this.setState({ isFocused });
    };

    const footerClassName = cx(
      "flex mt1 px1 pb1 PopoverFooter PopoverParameterFieldWidgetFooter",
      isEqualsOp ? "mr1 mb1" : "PopoverFooterWhenIsNotEqualOps",
    );

    const placeholder = isEditing
      ? t`Enter a default value...`
      : defaultPlaceholder;

    if (!isFocused) {
      return (
        <div
          ref={_ => (this._unfocusedElement = _)}
          className={`flex-full cursor-pointer ${
            MetabaseUtils.isCoin360() ? "ParameterFieldWidget--coin360" : ""
          }`}
          onClick={() => focusChanged(true)}
        >
          {savedValue.length > 0 && !outerList?.length > 0 ? (
            <ParameterFieldWidgetValue
              savedValue={savedValue}
              fields={fields}
            />
          ) : (
            <React.Fragment>
              <span>{placeholder}</span>
              <span>{children}</span>
            </React.Fragment>
          )}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Popover
            verticalAttachments={["top bottom"]}
            horizontalAttachments={[outerList?.length > 0 ? "right" : "left"]}
            hasArrow={false}
            onClose={() => focusChanged(false)}
          >
            <div className={cx("relative", { p2: !isEqualsOp })}>
              {verboseName && !isEqualsOp && (
                <div className="text-bold mb1">{verboseName}...</div>
              )}

              {_.times(numFields, index => {
                const value = multi ? unsavedValue : [unsavedValue[index]];
                const onValueChange = multi
                  ? newValues => this.setState({ value: newValues })
                  : ([value]) => {
                      const newValues = [...unsavedValue];
                      newValues[index] = value;
                      this.setState({ value: newValues });
                    };
                return (
                  <FieldValuesWidget
                    key={index}
                    className={cx("input", numFields - 1 !== index && "mb1")}
                    value={value}
                    outerList={outerList}
                    parameter={parameter}
                    parameters={parameters}
                    dashboard={dashboard}
                    onChange={onValueChange}
                    placeholder={placeholder}
                    fields={fields}
                    autoFocus={index === 0}
                    multi={multi}
                    disableSearch={disableSearch}
                    formatOptions={
                      operator &&
                      getFilterArgumentFormatOptions(operator, index)
                    }
                    color="brand"
                    style={{
                      borderWidth: BORDER_WIDTH,
                      minWidth: widgetWidth
                        ? widgetWidth + BORDER_WIDTH * 2
                        : null,
                    }}
                    minWidth={300}
                    maxWidth={400}
                  />
                );
              })}
              <div className={footerClassName}>
                <Button
                  primary
                  className="ml-auto"
                  disabled={
                    savedValue.length === 0 && unsavedValue.length === 0
                  }
                  onClick={() => {
                    setValue(unsavedValue.length > 0 ? unsavedValue : null);
                    focusChanged(false);
                  }}
                >
                  {savedValue.length > 0 ? t`Update` : t`Add`}
                </Button>
              </div>
            </div>
          </Popover>
          <span>{children}</span>
        </React.Fragment>
      );
    }
  }
}

ParameterFieldWidget.propTypes = propTypes;
