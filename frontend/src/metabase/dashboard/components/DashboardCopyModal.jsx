/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import { getPersonalCollectionId } from "metabase/lib/collection";
import { getDashboardComplete } from "../selectors";
import { isFgaPath } from "metabase/growth/utils/utils";
import { isABPath } from "metabase/ab/utils/utils";

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
  loadVip,
  canCreate,
  ...props
}) => {
  const [isShallowCopy, setIsShallowCopy] = useState(true);
  const fpIsShallowCopy = true;
  const [showVip, setShowVip] = useState(false);
  const publicAnalyticPermission = user && user.publicAnalytic === "write";
  const initialDashboardId =
    dashboardId ||
    Urls.extractEntityId(params.slug || params.uuid) ||
    dashboard?.entityId ||
    dashboard?.id;

  const title = getTitle(dashboard, fpIsShallowCopy);

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
    return (
      <div>
        <EntityCopyModal
          entityType="dashboards"
          entityObject={{
            ...dashboard,
            collection_id: initialCollectionId,
            is_shallow_copy: fpIsShallowCopy,
          }}
          form={
            publicAnalyticPermission
              ? Dashboards.forms.duplicate
              : Dashboards.forms.userDuplicate
          }
          title={title}
          overwriteOnInitialValuesChange
          copy={async object => {
            await loadVip();
            if (!canCreate) {
              setShowVip(true);
              throw { data: "" };
            }
            if (user && !publicAnalyticPermission) {
              object.collection_id = getPersonalCollectionId(user);
            }
            try {
              return copyDashboard(
                { id: initialDashboardId },
                dissoc(object, "id"),
              );
            } catch (e) {
              console.log(e);
            }
            return null;
          }}
          onClose={onClose}
          onSaved={dashboard => {
            loadVip();
            onClose && onClose();
            setTimeout(() => {
              let url = Urls.dashboard(dashboard);
              if (isFgaPath()) {
                url = url.startsWith('/') ?`/growth${url}`:`growth/${url}`;
              }
              if(isABPath()) {
                url = url.startsWith('/') ?`/ab${url}`:`ab/${url}`;
              }
              window.open(url);
            }, 10);
          }}
          {...props}
          onValuesChange={handleValuesChange}
        />
        {renderModal(this)}
      </div>
    );
  };

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
