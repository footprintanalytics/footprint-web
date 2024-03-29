/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { t, jt } from "ttag";
import _ from "underscore";

import Icon from "metabase/components/Icon";
import CollectionMoveModal from "metabase/containers/CollectionMoveModal";

import { color } from "metabase/lib/colors";
import * as Urls from "metabase/lib/urls";

import Dashboards from "metabase/entities/dashboards";
import Collection, { ROOT_COLLECTION } from "metabase/entities/collections";
import { getPersonalCollectionId } from "metabase/lib/collection";
import { getUser } from "metabase/reference/selectors";
import { ToastRoot } from "./DashboardMoveModal.styled";

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

const mapDispatchToProps = {
  setDashboardCollection: Dashboards.actions.setCollection,
};

class DashboardMoveModalInner extends React.Component {
  render() {
    const { location, onClose, setDashboardCollection, user } = this.props;
    const dashboardId =
      this.props.id ||
      Urls.extractEntityId(this.props.params.slug) ||
      location?.query?.id;
    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    const title = t`Move dashboard to…`;
    return (
      <CollectionMoveModal
        title={title}
        onClose={onClose}
        initialCollectionId={getPersonalCollectionId(user)}
        onMove={async destination => {
          //普通用户保存在自己的文件夹
          if (user && !publicAnalyticPermission) {
            destination.collection_id = getPersonalCollectionId(user);
          }
          await setDashboardCollection({ id: dashboardId }, destination, {
            notify: {
              message: (
                <DashboardMoveToast
                  collectionId={destination.id || ROOT_COLLECTION.id}
                />
              ),
            },
          });
          onClose();
        }}
      />
    );
  }
}

const DashboardMoveModal = _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  // Dashboards.load({
  //   id: (state, props) => Urls.extractCollectionId(props.params.slug),
  // }),
)(DashboardMoveModalInner);

export default DashboardMoveModal;

const DashboardMoveToast = ({ collectionId }) => (
  <ToastRoot>
    <Icon name="all" mr={1} color="white" />
    {jt`Dashboard moved to ${(
      <Collection.Link id={collectionId} ml={1} color={color("brand")} />
    )}`}
  </ToastRoot>
);
