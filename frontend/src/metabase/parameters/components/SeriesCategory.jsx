/* eslint "react/prop-types": "warn" */
/* eslint-disable react/prop-types */
import React from "react";
import "./ParameterValueWidget.css";
import { useQuery } from "react-query";
import { dashboardParams, publicDashboardParams } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { Checkbox } from "antd";
import { deriveFieldOperatorFromParameter } from "metabase/meta/Parameter";
import ParameterFieldWidget from "metabase/parameters/components/widgets/ParameterFieldWidget/ParameterFieldWidget";
import MetabaseUtils from "metabase/lib/utils";
import { pullAll } from "lodash";

const SeriesCategory = props => {
  const {
    setValue,
    value,
    parameter,
    dashboard,
    parameters,
    metadata,
    isEditing,
    onFocusChanged,
    getFields,
  } = props;

  const fields = getFields(metadata, parameter);

  const params = {
    dashboardId: dashboard?.id,
    paramId: parameter?.id,
  };
  const { isLoading, data } = useQuery(
    ["dashboardParams", params],
    async () => {
      return MetabaseUtils.isUUID(dashboard?.id)
        ? publicDashboardParams(params)
        : dashboardParams(params);
    },
    QUERY_OPTIONS,
  );

  if (isLoading) {
    return (
      <div
        className="parameter-value-widget__series-category-group overflow-hidden"
        style={{ minWidth: 180, width: "100%", height: 32 }}
      >
        <div className="parameter-value-widget__series-category-group-loading">
          Data Loading...
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div
        className="parameter-value-widget__series-category-group overflow-hidden"
        style={{ minWidth: 180, width: "100%", height: 32 }}
      />
    );
  }

  const outerList = data && data?.data?.filter(d => d)?.slice(0, 6);
  const otherList = data && data?.data?.filter(d => d)?.slice(6);
  const otherValues = pullAll([...(value || [])], [...outerList]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox.Group
        className="parameter-value-widget__series-category-group"
        value={value}
        buttonStyle="solid"
        onChange={checkedValues => {
          const values = [...checkedValues, ...otherValues];
          setValue(values.length ? values : null);
        }}
      >
        {outerList.map(item => (
          <Checkbox
            key={item}
            className="parameter-value-widget__series-category-group-item"
            value={item}
          >
            {item}
          </Checkbox>
        ))}
      </Checkbox.Group>
      {otherList?.length > 0 && (
        <ParameterFieldWidget
          parameter={parameter}
          parameters={parameters}
          dashboard={dashboard}
          placeholder={" "}
          value={value}
          fields={fields}
          setValue={setValue}
          outerList={outerList}
          isEditing={isEditing}
          focusChanged={onFocusChanged}
          operator={deriveFieldOperatorFromParameter(parameter)}
        >
          <span className="parameter-value-widget__series-category-group-more">
            More
          </span>
        </ParameterFieldWidget>
      )}
    </div>
  );
};
export default React.memo(SeriesCategory);
