/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { dissoc } from "icepick";

import { replace } from "react-router-redux";
import * as Urls from "metabase/lib/urls";

import Dashboards from "metabase/entities/dashboards";
import Collections from "metabase/entities/collections";

import EntityCopyModal from "metabase/entities/containers/EntityCopyModal";

import { getDashboardComplete } from "../selectors";

import { loadCurrentUserVip } from "metabase/redux/user";
import { getUserCreateDashboardPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getUser } from "metabase/reference/selectors";
import Modal from "metabase/components/Modal";
import { getPersonalCollectionId } from "metabase/lib/collection";

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

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DashboardCopyModal extends React.Component {
  state = {
    showVip: false,
  };

  render() {
    const {
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
    } = this.props;
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
    const InnerPanel = () => {
      return (
        <div>
          <EntityCopyModal
            entityType="dashboards"
            entityObject={{
              ...dashboard,
              collection_id: initialCollectionId,
            }}
            form={
              publicAnalyticPermission
                ? Dashboards.form.adminDashboardFields
                : Dashboards.form.userDashboardFields
            }
            overwriteOnInitialValuesChange
            copy={async object => {
              const { loadVip } = this.props;
              await loadVip();
              const { canCreate } = this.props;
              if (!canCreate) {
                this.setState({ showVip: true });
                throw { data: "" };
              }
              if (user && !publicAnalyticPermission) {
                object.collection_id = getPersonalCollectionId(user);
              }
              try {
                const result = copyDashboard(
                  { id: initialDashboardId },
                  dissoc(object, "id"),
                );
                return result;
              } catch (e) {
                console.log(e);
              }
              return null;
            }}
            onClose={onClose}
            onSaved={async dashboard => {
              console.log("copy dashboard", dashboard);
              const { loadVip } = this.props;
              loadVip();
              // await copy({
              //   fileName: ossPath(`dashboard/${initialDashboardId}.png`),
              //   newFileName: ossPath(`dashboard/${dashboard.id}.png`),
              // });
              onClose && onClose();
              setTimeout(() => {
                // onReplaceLocation(Urls.dashboard(dashboard))
                window.open(Urls.dashboard(dashboard));
              }, 10);
            }}
            {...props}
          />
          {renderModal(this)}
        </div>
      );
    };
    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    const initialDashboardId =
      dashboardId ||
      Urls.extractEntityId(params.slug || params.uuid) ||
      dashboard?.entityId ||
      dashboard?.id;
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
  }
}

export default DashboardCopyModal;
