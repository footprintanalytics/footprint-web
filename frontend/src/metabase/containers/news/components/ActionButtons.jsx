/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Tooltip from "metabase/components/Tooltip";
import { t } from "ttag";
import Button from "metabase/components/Button";
import { message, Modal } from "antd";
import { mediaDelete } from "metabase/new-service";
import { trackStructEvent } from "metabase/lib/analytics";
import CopyShortLink from "metabase/components/CopyShortLink";

const ActionButtons = props => {
  const {
    onChangeLocation,
    item,
    // isCreator,
    isMarket,
    isAdmin,
    removeSuccess,
    tooltipEnabled = true,
    borderless,
    detailUrl,
    hasPublishPermission,
  } = props;

  const relatedDashboardUrl = item && item.relatedDashboardUrl;
  const mediaInfoId = item && item.mediaInfoId;

  const editAction = () => {
    onChangeLocation && onChangeLocation(`news/publish/${mediaInfoId}`);
  };

  const removeAction = () => {
    Modal.confirm({
      title: "Delete Article",
      content: "Are you sure you want to delete this article?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        removeApi();
      },
    });
  };

  const removeApi = async () => {
    const hide = message.loading("Delete...");
    try {
      await mediaDelete({ mediaInfoId: mediaInfoId });
      removeSuccess && removeSuccess(mediaInfoId);
    } catch (e) {
    } finally {
      hide && hide();
    }
  };

  return (
    <div className="flex align-center ml-auto">
      {hasPublishPermission && (
        <Tooltip tooltip={t`Edit`} isEnabled={false}>
          <Button
            className="ml1 Question-header-btn-with-text"
            iconColor="#7A819B"
            icon="pencil"
            iconSize={16}
            color={"#7A819B"}
            borderless={borderless}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              trackStructEvent("news actionbutton click edit");
              editAction();
            }}
          />
        </Tooltip>
      )}
      {hasPublishPermission && (
        <Tooltip tooltip={t`Remove`} isEnabled={tooltipEnabled}>
          <Button
            className="ml1 Question-header-btn-with-text"
            iconColor="#7A819B"
            icon="remove"
            iconSize={16}
            color={"#7A819B"}
            borderless={borderless}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              trackStructEvent("news actionbutton click remove");
              removeAction();
            }}
          />
        </Tooltip>
      )}
      {(isMarket || isAdmin) && (
        <Tooltip tooltip={t`News short link`} isEnabled={tooltipEnabled}>
          <CopyShortLink url={detailUrl}>
            <Button
              className="ml1 Question-header-btn-with-text"
              iconColor="#7A819B"
              icon="shortLink"
              iconSize={16}
              color={"#7A819B"}
              borderless={borderless}
            />
          </CopyShortLink>
        </Tooltip>
      )}
      {(isMarket || isAdmin) && relatedDashboardUrl && (
        <Tooltip tooltip={t`Dashboard short link`} isEnabled={tooltipEnabled}>
          <CopyShortLink url={relatedDashboardUrl}>
            <Button
              className="ml1 Question-header-btn-with-text"
              iconColor="#7A819B"
              icon="dashboardShortLink"
              iconSize={16}
              color={"#7A819B"}
              borderless={borderless}
            />
          </CopyShortLink>
        </Tooltip>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
