import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import cx from "classnames";
import _ from "underscore";

import dayjs from "dayjs";
import {
  getParameterIconName,
  getParameterWidgetTitle,
} from "metabase/parameters/utils/ui";

import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import Icon from "metabase/components/Icon";
import DateSingleWidget from "metabase/components/DateSingleWidget";
import DateRangeWidget from "metabase/components/DateRangeWidget";
import DateRelativeWidget from "metabase/components/DateRelativeWidget";
import DateMonthYearWidget from "metabase/components/DateMonthYearWidget";
import DateQuarterYearWidget from "metabase/components/DateQuarterYearWidget";
import DateAllOptionsWidget from "metabase/components/DateAllOptionsWidget";
import TextWidget from "metabase/components/TextWidget";
import WidgetStatusIcon from "metabase/parameters/components/WidgetStatusIcon";
import FormattedParameterValue from "metabase/parameters/components/FormattedParameterValue";
import NumberInputWidget from "metabase/parameters/components/widgets/NumberInputWidget";
import StringInputWidget from "metabase/parameters/components/widgets/StringInputWidget";
import {
  getNumberParameterArity,
  getStringParameterArity,
} from "metabase-lib/parameters/utils/operators";
import {
  isDateParameter,
  isNumberParameter,
} from "metabase-lib/parameters/utils/parameter-type";

import ParameterFieldWidget from "./widgets/ParameterFieldWidget/ParameterFieldWidget";
import SeriesCategory from "metabase/parameters/components/SeriesCategory";
import S from "./ParameterWidget.css";
import { Radio, DatePicker } from "antd";
import "./ParameterValueWidget.css";

const DATE_WIDGETS = {
  "date/single": DateSingleWidget,
  "date/range": DateRangeWidget,
  "date/relative": DateRelativeWidget,
  "date/month-year": DateMonthYearWidget,
  "date/quarter-year": DateQuarterYearWidget,
  "date/all-options": DateAllOptionsWidget,
  "date/series-date": DateAllOptionsWidget,
  "date/series-time": DateAllOptionsWidget,
};

class ParameterValueWidget extends Component {
  static propTypes = {
    parameter: PropTypes.object.isRequired,
    name: PropTypes.string,
    value: PropTypes.any,
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isEditing: PropTypes.bool,
    noReset: PropTypes.bool,
    commitImmediately: PropTypes.bool,
    focusChanged: PropTypes.func,
    isFullscreen: PropTypes.bool,
    className: PropTypes.string,
    parameters: PropTypes.array,
    dashboard: PropTypes.object,
  };

  state = {
    isFocused: false,
    dateRange: [],
  };

  constructor(props) {
    super(props);

    this.valuePopover = React.createRef();
    this.trigger = React.createRef();
  }

  onFocusChanged = isFocused => {
    const { focusChanged: parentFocusChanged } = this.props;
    if (parentFocusChanged) {
      parentFocusChanged(isFocused);
    }
    this.setState({ ...this.state, isFocused });
  };

  onPopoverClose = () => {
    if (this.valuePopover.current) {
      this.valuePopover.current.close();
    }
  };

  getTargetRef = () => {
    return this.trigger.current;
  };

  renderSeriesCategory() {
    return <SeriesCategory {...this.props} getFields={getFields} />;
  }

  render() {
    const {
      parameter,
      value,
      setValue,
      isEditing,
      placeholder,
      isFullscreen,
      isNightMode,
      noReset,
      className,
      dashboard,
    } = this.props;
    const { isFocused } = this.state;
    const hasValue = value != null;
    const { noPopover } = getWidgetDefinition(parameter);
    const parameterTypeIcon = getParameterIconName(parameter);
    const showTypeIcon = !isEditing && !hasValue && !isFocused;

    const renderSeriesDate = () => {
      const seriesData = [
        {
          value: "past1days",
          label: "1D",
        },
        {
          value: "past7days",
          label: "7D",
        },
        // {
        //   value: "past14days",
        //   label: "14D",
        // },
        {
          value: "past30days",
          label: "30D",
        },
        {
          value: "past90days",
          label: "90D",
        },
        {
          value: "past180days",
          label: "180D",
        },
        {
          value: "2010-01-01~",
          label: "Max",
        },
      ];
      const { setValue, value } = this.props;
      const defaultDateRange = value?.startsWith("past")?[]:value?.split("~")??[];
      const disabledDate = (current) => {
        // Can not select days before today and today
        return current > dayjs().endOf('day')||current<dayjs('2010-01-01');
      };
      return (
        <>
          <Radio.Group
            className="parameter-value-widget__series-date-group"
            value={value}
            buttonStyle="solid"
            onChange={({ target }) => {
              setValue(target.value);
              this.setState({
                ...this.state,
                dateRange: convertToRange(target.value)?.split("~") ?? [],
              });
            }}
          >
            {seriesData.map(item => {
              return (
                <Radio.Button
                  key={item.value}
                  className="parameter-value-widget__series-date-group-item"
                  value={item.value}
                >
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
          <DatePicker.RangePicker
            bordered={false}
            format="YYYY-MM-DD"
            allowClear={false}
            disabledDate={disabledDate}
            suffixIcon={
              <Icon
                style={{
                  color: value?.startsWith("past")
                    ? "inherit"
                    : "var(--color-brand)",
                }}
                name={"range_picker"}
                size={18}
              />
            }
            defaultValue={
              defaultDateRange?.length > 1?[dayjs(defaultDateRange[0]),dayjs(defaultDateRange[1])]:null
            }
            value={
              value?.startsWith("past")?null:[dayjs(this.state.dateRange[0]),dayjs(this.state.dateRange[1])]

              // this.state.dateRange?.length > 1
              //   ? [
              //       dayjs(this.state.dateRange[0], "YYYY-MM-DD"),
              //       dayjs(this.state.dateRange[1], "YYYY-MM-DD"),
              //     ]
              //   : null
            }
            showTime={false}
            onChange={(values, formatString) => {
              if (formatString) {
                this.setState({ ...this.state, dateRange: formatString });
                setValue(`${formatString[0]}~${formatString[1]}`);
              }
            }}
            className={`DatePicker ${
              value?.startsWith("past") ? "" : "DatePickerActive"
            }`}
          />
        </>
      );
    };
    const renderSeriesTime = () => {
      const seriesTime = [
        // {
        //   value: "past30minutes",
        //   label: "30Mins",
        // },
        {
          value: "past1hours",
          label: "1H",
        },
        {
          value: "past3hours",
          label: "3H",
        },
        {
          value: "past6hours",
          label: "6H",
        },
        {
          value: "past12hours",
          label: "12H",
        },
        {
          value: "past24hours",
          label: "24H",
        },
      ];
      const { setValue, value } = this.props;

      return (
        <Radio.Group
          className="parameter-value-widget__series-date-group"
          value={value}
          buttonStyle="solid"
          onChange={({ target }) => {
            setValue(target.value);
          }}
        >
          {seriesTime.map(item => {
            return (
              <Radio.Button
                key={item.value}
                className="parameter-value-widget__series-date-group-item"
                value={item.value}
              >
                {item.label}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      );
    };

    if (parameter.type === "date/series-date") {
      return (
        <div className="flex align-center">
          {renderSeriesDate()}
        {hasValue && (
            <WidgetStatusIcon
              isFullscreen={isFullscreen}
              hasValue={hasValue}
              noReset={noReset}
              noPopover={noPopover}
              isFocused={isFocused}
              setValue={setValue}
            />
          )}
        </div>
      );
    }
    if (parameter.type === "date/series-time") {
      return (
        <div className="flex align-center">
          {renderSeriesTime()}
          {hasValue && (
            <WidgetStatusIcon
              isFullscreen={isFullscreen}
              hasValue={hasValue}
              noReset={noReset}
              noPopover={noPopover}
              isFocused={isFocused}
              setValue={setValue}
            />
          )}
        </div>
      );
    }
    /*if (parameter.type === "series_category" && !!dashboard) {
      return (
        <div className="flex align-center">
          {this.renderSeriesCategory()}
          {hasValue && (
            <WidgetStatusIcon
              isFullscreen={isFullscreen}
              hasValue={hasValue}
              noReset={noReset}
              noPopover={noPopover}
              isFocused={isFocused}
              setValue={setValue}
            />
          )}
        </div>
      );
    }*/

    if (noPopover) {
      return (
        <div
          ref={this.trigger}
          className={cx(S.parameter, S.noPopover, className, {
            [isNightMode ? S.selected_night : S.selected]: hasValue,
            [S.isEditing]: isEditing,
          })}
        >
          {showTypeIcon && (
            <Icon
              name={parameterTypeIcon}
              className="flex-align-left mr1 flex-no-shrink"
              size={14}
            />
          )}
          <Widget
            {...this.props}
            target={this.getTargetRef()}
            onFocusChanged={this.onFocusChanged}
            onPopoverClose={this.onPopoverClose}
          />
          <WidgetStatusIcon
            isFullscreen={isFullscreen}
            hasValue={hasValue}
            noReset={noReset}
            noPopover={!!noPopover}
            isFocused={isFocused}
            setValue={setValue}
          />
        </div>
      );
    } else {
      const placeholderText = isEditing
        ? isDateParameter(parameter)
          ? t`Select a default value…`
          : t`Enter a default value…`
        : placeholder || t`Select…`;
      return (
        <PopoverWithTrigger
          ref={this.valuePopover}
          targetOffsetX={16}
          triggerElement={
            <div
              ref={this.trigger}
              className={cx(S.parameter, className, {
                [isNightMode ? S.selected_night : S.selected]: hasValue,
              })}
            >
              {showTypeIcon && (
                <Icon
                  name={parameterTypeIcon}
                  className="flex-align-left mr1 flex-no-shrink"
                  size={14}
                />
              )}
              <div className="mr1 text-nowrap fullscreen-night-text">
                <FormattedParameterValue
                  parameter={parameter}
                  value={value}
                  placeholder={placeholderText}
                />
              </div>
              <WidgetStatusIcon
                isFullscreen={isFullscreen}
                isNightMode={isNightMode}
                hasValue={hasValue}
                noReset={noReset}
                noPopover={!!noPopover}
                isFocused={isFocused}
                setValue={setValue}
              />
            </div>
          }
          target={this.getTargetRef}
          // make sure the full date picker will expand to fit the dual calendars
          autoWidth={parameter.type === "date/all-options"}
        >
          <Widget
            {...this.props}
            target={this.getTargetRef()}
            onFocusChanged={this.onFocusChanged}
            onPopoverClose={this.onPopoverClose}
          />
        </PopoverWithTrigger>
      );
    }
  }
}

export default ParameterValueWidget;

function getFields(metadata, parameter) {
  if (!metadata) {
    return [];
  }
  return (
    parameter.fields ??
    getFieldIds(parameter)
      .map(id => metadata.field(id))
      .filter(f => f != null)
  );
}

function getFieldIds(parameter) {
  const { field_ids = [], field_id } = parameter;
  return field_id ? [field_id] : field_ids;
}

/**
 * past10days -> 2023-06-20~2023-06-30
 * @param {*} dateString
 * @returns
 */
function convertToRange(dateString) {
  const today = new Date(); // 获取当前日期
  const endDate = today.toISOString().slice(0, 10);
  const match = dateString.match(/^past(\d+)days$/);
  if (match) {
    const step = match[1];
    const startDate = new Date(today.getTime() - step * 24 * 60 * 60 * 1000);
    const startDateString = startDate.toISOString().slice(0, 10);
    return `${startDateString}~${endDate}`;
  } else {
    return null;
  }
}

function Widget({
  parameter,
  value,
  setValue,
  onPopoverClose,
  className,
  isEditing,
  commitImmediately,
  placeholder,
  onFocusChanged,
  parameters,
  dashboard,
  target,
}) {
  const normalizedValue = Array.isArray(value)
    ? value
    : [value].filter(v => v != null);

  if (isDateParameter(parameter)) {
    const DateWidget = DATE_WIDGETS[parameter.type];
    return (
      <DateWidget value={value} setValue={setValue} onClose={onPopoverClose} />
    );
  } else if (parameter.hasVariableTemplateTagTarget) {
    return (
      <TextWidget
        value={value}
        setValue={setValue}
        className={className}
        isEditing={isEditing}
        commitImmediately={commitImmediately}
        placeholder={placeholder}
        focusChanged={onFocusChanged}
      />
    );
  } else if (isNumberParameter(parameter)) {
    const arity = getNumberParameterArity(parameter);
    return (
      <NumberInputWidget
        value={normalizedValue}
        setValue={value => {
          setValue(value);
          onPopoverClose();
        }}
        arity={arity}
        infixText={typeof arity === "number" && arity > 1 ? t`and` : undefined}
        autoFocus
        placeholder={isEditing ? t`Enter a default value…` : undefined}
        label={getParameterWidgetTitle(parameter)}
      />
    );
  } else if (!_.isEmpty(parameter.fields)) {
    return (
      <ParameterFieldWidget
        target={target}
        parameter={parameter}
        parameters={parameters}
        dashboard={dashboard}
        placeholder={placeholder}
        value={normalizedValue}
        fields={parameter.fields}
        setValue={value => {
          setValue(value);
          onPopoverClose();
        }}
        isEditing={isEditing}
        focusChanged={onFocusChanged}
      />
    );
  } else {
    return (
      <StringInputWidget
        value={normalizedValue}
        setValue={value => {
          setValue(value);
          onPopoverClose();
        }}
        className={cx(className, "parameter-widget-input")}
        autoFocus
        placeholder={isEditing ? t`Enter a default value…` : undefined}
        arity={getStringParameterArity(parameter)}
        label={getParameterWidgetTitle(parameter)}
      />
    );
  }
}

Widget.propTypes = {
  ...ParameterValueWidget.propTypes,
  onPopoverClose: PropTypes.func.isRequired,
  onFocusChanged: PropTypes.func.isRequired,
};

function getWidgetDefinition(parameter) {
  if (DATE_WIDGETS[parameter.type]) {
    return DATE_WIDGETS[parameter.type];
  } else if (parameter.hasVariableTemplateTagTarget) {
    return TextWidget;
  } else if (isNumberParameter(parameter)) {
    return NumberInputWidget;
  } else if (!_.isEmpty(parameter.fields)) {
    return ParameterFieldWidget;
  } else {
    return StringInputWidget;
  }
}
