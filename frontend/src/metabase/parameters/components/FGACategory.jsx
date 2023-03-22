/* eslint "react/prop-types": "warn" */
/* eslint-disable react/prop-types */
import React, { memo, useEffect, useState } from "react";
import { getValuesMode, searchField } from "metabase/components/FieldValuesWidget";
import { addRemappings, fetchFieldValues } from "metabase/redux/metadata";
import { fetchDashboardParameterValues } from "metabase/dashboard/actions";
import Fields from "metabase/entities/fields";
import { compose } from "underscore";
import connect from "react-redux/lib/connect/connect";
import CategoryForFga from "metabase/containers/protocols/components/Protocols/Category2";

const FGACategory = props => {
  const {
    dashboard,
    fields,
    disableSearch,
    disablePKRemappingForSearch,
    fetchFieldValues,
    fetchDashboardParameterValues,
    addRemappings,
    parameter,
    parameters,
    setValue,
  } = props;

  const [status, setStatus] = useState({
    loadingState: "LOADING",
    options: [],
  });

  const data = status.options.map(item => item[0]);
  const isLoading = status.loadingState === "LOADING";

  useEffect(() => {
    if (status.loadingState !== "LOADED") {
      fetchValues();
    }
  }, [fetchValues, status.loadingState])

  const fetchValues = async (query) => {
    setStatus({
      loadingState: "LOADING",
      options: [],
    });

    let options = [];
    let valuesMode = status.valuesMode;
    try {
      if (usesChainFilterEndpoints(dashboard)) {
        console.log("xxx")
        const { results, has_more_values } =
          await fetchDashboardParamValues(query);
        options = results;
        valuesMode = has_more_values ? "search" : valuesMode;
      } else {
        console.log("yyy")
        options = await fetchFieldValues(query);
        valuesMode = getValuesMode(
          fields,
          disableSearch,
          disablePKRemappingForSearch,
        );
      }
    } finally {
      updateRemappings(options);

      setStatus({
        loadingState: "LOADED",
        options,
        valuesMode,
      });
    }
  }

  const fetchDashboardParamValues = async query => {
    const args = {
      dashboardId: dashboard?.id,
      parameter,
      parameters,
      query,
    };
    console.log("fetchDashboardParamValues", args)
    return fetchDashboardParameterValues(args);
  };
  console.log("this.props", props)
  const updateRemappings = (options) => {
    if (showRemapping(fields)) {
      const [field] = fields;
      if (
        field.remappedField() ===
        searchField(field, disablePKRemappingForSearch)
      ) {
        addRemappings(field.id, options);
      }
    }
  }

  return (
    <div>
      <CategoryForFga
        categorys={data}
        actives={parameter.value}
        router={null}
        title={parameter.name}
        isLoading={isLoading}
        onChange={actives => {
          setValue(actives);
        }}
      />
    </div>
  );
};

function showRemapping(fields) {
  return fields.length === 1;
}

function usesChainFilterEndpoints(dashboard) {
  return dashboard?.id;
}

function mapStateToProps(state, { fields = [] }) {
  return {
    fields: fields.map(
      field =>
        Fields.selectors.getObject(state, { entityId: field.id }) || field,
    ),
  };
}

const mapDispatchToProps = {
  addRemappings,
  fetchFieldValues,
  fetchDashboardParameterValues,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(
  memo(FGACategory),
);
