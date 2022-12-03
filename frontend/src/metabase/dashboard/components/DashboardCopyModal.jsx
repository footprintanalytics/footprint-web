/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { dissoc } from "icepick";
import _ from "underscore";
import { t } from "ttag";

import { replace } from "react-router-redux";
import * as Urls from "metabase/lib/urls";

import Dashboards from "metabase/entities/dashboards";
import Collections from "metabase/entities/collections";

import EntityCopyModal from "metabase/entities/containers/EntityCopyModal";

import { loadCurrentUserVip } from "metabase/redux/user";
import { getUserCreateDashboardPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getUser } from "metabase/reference/selectors";
import Modal from "metabase/components/Modal";
import { getDashboardComplete } from "../selectors";

const mapStateToProps = (state, props) => {
  const dashboard = props.dashboard || getDashboardComplete(state, props);
  return {
    dashboard,
    initialCollectionId: Collections.selectors.getInitialCollectionId(state, {
      ...props,
      collectionId: dashboard && dashboard.collection_id,
    }),
    canCreate: getUserCreateDashboardPermission(state),
    user: getUser(state, props),
  };
};

const mapDispatchToProps = {
  loadVip: loadCurrentUserVip,
  copyDashboard: Dashboards.actions.copy,
  onReplaceLocation: replace,
};

const getTitle = (dashboard, isShallowCopy) => {
  if (!dashboard?.name) {
    return "";
  } else if (isShallowCopy) {
    return t`Duplicate "${dashboard.name}"`;
  } else {
    return t`Duplicate "${dashboard.name}" and its questions`;
  }
};

const DashboardCopyModalInner = ({
  isOpen = false,
  fromRoute = true,
  onClose,
  // onReplaceLocation,
  copyDashboard,
  dashboard,
  initialCollectionId,
  params,
  user,
  dashboardId,
  ...props
}) => {
  const [isShallowCopy, setIsShallowCopy] = useState(true);
  const [showVip, setShowVip] = useState(false);
  const initialDashboardId = Urls.extractEntityId(params.slug);

  const title = getTitle(dashboard, isShallowCopy);

  const renderModal = context => {
    return (
      showVip && (
        <NeedPermissionModal
          title="Your account has reached the limit of number of dashboard, please upgrade the account to unlock more"
          onClose={() => context.setState({ showVip: false })}
        />
      )
    );
  };

  const handleValuesChange = ({ is_shallow_copy }) => {
    setIsShallowCopy(is_shallow_copy);
  };

  const InnerPanel = () => {
    return (<div>
      <EntityCopyModal
        entityType="dashboards"
        entityObject={{
          ...dashboard,
          collection_id: initialCollectionId,
        }}
        form={Dashboards.forms.duplicate}
        title={title}
        overwriteOnInitialValuesChange
        copy={async object => {
          const { loadVip } = this.props;
          await loadVip();
          const { canCreate } = this.props;
          if (!canCreate) {
            setShowVip(true);
            throw { data: "" };
          }
          copyDashboard({ id: initialDashboardId }, dissoc(object, "id"))
        }}
        onClose={onClose}
        onSaved={dashboard => {
          console.log("copy dashboard", dashboard);
          const { loadVip } = this.props;
          loadVip();
          onClose && onClose();
          setTimeout(() => {
            window.open(Urls.dashboard(dashboard));
          }, 10);
        }}
        {...props}
        onValuesChange={handleValuesChange}
      />
      {renderModal(this)}
    </div>
  )};

  return !fromRoute ? (
    isOpen ? (
      <Modal className={"dashboardCopyModalRoot"}>
        <InnerPanel {...props} />
      </Modal>
    ) : (
      <React.Fragment />
    )
  ) : (
    <InnerPanel {...props} />
  );
};

const DashboardCopyModal = _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardCopyModalInner);

export default DashboardCopyModal;
