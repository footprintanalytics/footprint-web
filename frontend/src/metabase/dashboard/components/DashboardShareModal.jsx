/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import * as Urls from "metabase/lib/urls";

import EmbedModalContent from "metabase/public/components/widgets/EmbedModalContent";

import { getDashboardComplete } from "../selectors";

import {
  createPublicLink,
  deletePublicLink,
  updateEnableEmbedding,
  updateEmbeddingParams,
} from "../dashboard";

const mapStateToProps = (state, props) => {
  const dashboard = getDashboardComplete(state, props);
  return {
    dashboard,
  };
};

const mapDispatchToProps = {
  createPublicLink,
  deletePublicLink,
  updateEnableEmbedding,
  updateEmbeddingParams,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DashboardShareModal extends React.Component {
  render() {
    const {
      onClose,
      additionalClickActions,
      className,
      createPublicLink,
      dashboard,
      deletePublicLink,
      updateEnableEmbedding,
      updateEmbeddingParams,
      ...props
    } = this.props;
    return (
      <EmbedModalContent
        {...props}
        className={className}
        resource={dashboard}
        resourceParameters={dashboard && dashboard.parameters}
        resourceType="dashboard"
        onCreatePublicLink={() => createPublicLink(dashboard)}
        onDisablePublicLink={() => deletePublicLink(dashboard)}
        onUpdateEnableEmbedding={enableEmbedding =>
          updateEnableEmbedding(dashboard, enableEmbedding)
        }
        onUpdateEmbeddingParams={embeddingParams =>
          updateEmbeddingParams(dashboard, embeddingParams)
        }
        onClose={() => {
          this._modal && this._modal.close();
          onClose();
          additionalClickActions();
        }}
        getPublicUrl={({ public_uuid }) =>
          Urls.publicDashboard({ uuid: public_uuid })
        }
      />
    );
  }
}

export default DashboardShareModal;
