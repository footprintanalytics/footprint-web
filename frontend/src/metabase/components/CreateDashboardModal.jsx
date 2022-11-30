/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";
import _ from "underscore";

import Collection from "metabase/entities/collections";
import Dashboard from "metabase/entities/dashboards";

import { loadCurrentUserVip } from "metabase/redux/user";
import { getUserCreateDashboardPermission } from "metabase/selectors/user";
import { getUser } from "metabase/reference/selectors";
import NeedPermissionModal from "./NeedPermissionModal";

const mapStateToProps = (state, props) => ({
  initialCollectionId: Collection.selectors.getInitialCollectionId(
    state,
    props,
  ),
  canCreate: getUserCreateDashboardPermission(state),
  user: getUser(state, props),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  loadVip: loadCurrentUserVip,
};

class CreateDashboardModal extends Component {
  static propTypes = {
    onSaved: PropTypes.func,
    onClose: PropTypes.func,
  };

  state = {
    showVip: false,
  };

  onSaved = dashboard => {
    const { loadVip, onClose, onSavedOtherAction } = this.props;

    loadVip && loadVip();

    if (onSavedOtherAction) {
      onSavedOtherAction(dashboard);
    }

    if (onClose) {
      onClose();
    }

/*    const url = Urls.dashboard(dashboard, { editMode: true });
    onChangeLocation(url);*/
  };

  onBeforeSubmit = async () => {
    const { loadVip } = this.props;
    await loadVip();
    const { canCreate } = this.props;
    if (!canCreate) {
      this.setState({ showVip: true });
    }
    return canCreate;
  };

  render() {
    const { initialCollectionId, onSaved, onClose, user } = this.props;

    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    const renderModal = context => {
      return (
        context.state.showVip && (
          <NeedPermissionModal
            title="Your account has reached the limit of number of dashboard, please upgrade the account to unlock more"
            onClose={() => context.setState({ showVip: false })}
          />
        )
      );
    };

    return (
      <div>
      <Dashboard.ModalForm
        form={publicAnalyticPermission ? Dashboard.forms.create_admin : Dashboard.forms.create}
        overwriteOnInitialValuesChange
        dashboard={{ collection_id: initialCollectionId }}
        onBeforeSubmit={this.onBeforeSubmit}
        onClose={onClose}
        onSaved={typeof onSaved === "function" ? onSaved : this.onSaved}
      />
        {renderModal(this)}
      </div>
    );
  }
}

export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(CreateDashboardModal);
