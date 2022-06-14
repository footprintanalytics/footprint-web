/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import querystring from "querystring";

import ParametersList from "metabase/parameters/components/ParametersList";
import { getParameterValuesBySlug } from "metabase/meta/Parameter";
import { getMetadata } from "metabase/selectors/metadata";
import { loginModalShowAction } from "metabase/redux/control";

class Parameters extends Component {
  componentDidUpdate() {
    const { parameters, parameterValues, dashboard } = this.props;

    if (this.props.syncQueryString) {
      // sync parameters to URL query string
      const parameterValuesBySlug = getParameterValuesBySlug(
        parameters,
        parameterValues,
        dashboard && { preserveDefaultedParameters: true },
      );

      let search = querystring.stringify(parameterValuesBySlug);
      search = search ? "?" + search : "";

      if (search !== window.location.search) {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + search + window.location.hash,
        );
      }
    }
  }

  render() {
    const {
      className,

      parameters,
      dashboard,
      editingParameter,
      parameterValues,

      isFullscreen,
      isNightMode,
      hideParameters,
      isEditing,
      isQB,
      vertical,
      commitImmediately,
      isPublic,
      auth,

      setLoginModalShow,
      setParameterName,
      setParameterValue,
      setParameterDefaultValue,
      setParameterIndex,
      removeParameter,
      setEditingParameter,
    } = this.props;

    return (
      <ParametersList
        className={className}
        parameters={parameters}
        dashboard={dashboard}
        editingParameter={editingParameter}
        parameterValues={parameterValues}
        isFullscreen={isFullscreen}
        isNightMode={isNightMode}
        hideParameters={hideParameters}
        isEditing={isEditing}
        isQB={isQB}
        vertical={vertical}
        commitImmediately={commitImmediately}
        setParameterName={setParameterName}
        setParameterValue={setParameterValue}
        setParameterDefaultValue={setParameterDefaultValue}
        setParameterIndex={setParameterIndex}
        removeParameter={removeParameter}
        setEditingParameter={setEditingParameter}
        isPublic={isPublic}
        auth={auth}
        setLoginModalShow={setLoginModalShow}
      />
    );
  }
}

Parameters.defaultProps = {
  syncQueryString: false,
};

const mapStateToProps = state => ({
  metadata: getMetadata(state),
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
