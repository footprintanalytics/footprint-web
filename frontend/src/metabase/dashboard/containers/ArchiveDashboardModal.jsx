/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import _ from "underscore";

import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";

import { message } from "antd";
import * as Urls from "metabase/lib/urls";

import Collection from "metabase/entities/collections";
import Dashboard from "metabase/entities/dashboards";

import ArchiveModal from "metabase/components/ArchiveModal";
import { getUser } from "metabase/home/selectors";

const mapDispatchToProps = {
  setDashboardArchived: Dashboard.actions.setArchived,
  push,
};

class ArchiveDashboardModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  close = () => {
    // since we need to redirect back to the parent collection when archiving
    // we have to call this here first to unmount the modal and then push to the
    // parent collection
    this.props.onClose();
    if (this.props.dashboard.archived) {
      this.props.push("/");
    }
  };

  archive = async () => {
    const hide = message.loading("Action in progress..", 0);
    const { otherSuccessAction, location, router, user } = this.props;
    const dashboardId =
      this.props.id ||
      Urls.extractEntityId(this.props.params.slug) ||
      location?.query?.id;
    await this.props.setDashboardArchived(
      { id: dashboardId, name: location?.query?.uniqueName },
      true,
    );
    otherSuccessAction && otherSuccessAction();
    setTimeout(() => router.replace(`/@${user.name}?model=dashboard`));
    hide();
  };

  render() {
    const { dashboard } = this.props;
    return (
      <ArchiveModal
        title={
          dashboard?.is_app_age
            ? t`Delete this page?`
            : t`Delete this dashboard?`
        }
        message={t`Are you sure you want to do this?`}
        onClose={this.close}
        onArchive={this.archive}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: getUser(state),
});

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  Dashboard.load({
    id: (state, props) => props.id || Urls.extractCollectionId(props.params.slug) || props.location.query.id,
  }),
  Collection.load({
    id: (state, props) => props.dashboard && props.dashboard.collection_id,
  }),
  withRouter,
)(ArchiveDashboardModal);
