import React, { useEffect, useState } from "react";
import { Flex } from "grid-styled";
import SharingPane from "metabase/public/components/widgets/SharingPane";
import * as Urls from "metabase/lib/urls";
import ModalContent from "metabase/components/ModalContent";
import Modal from "metabase/components/Modal";
import PropTypes from "prop-types";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";
import { connect } from "react-redux";
import { getIsPublicSharingEnabled } from "metabase/selectors/settings";
import {
  createDashboardSecret,
  createPublicLink,
  deletePublicLink,
  updateEmbeddingParams,
  updateEnableEmbedding,
} from "metabase/dashboard/actions";
import { CardApi, DashboardApi } from "metabase/services";
import { trackStructEvent } from "metabase/lib/analytics";
import { createCardSecret } from "metabase/query_builder/actions";
import { browserHistory } from "react-router";

const mapStateToProps = (state, props) => ({
  isAdmin: getUserIsAdmin(state, props),
  isPublicSharingEnabled: getIsPublicSharingEnabled(state, props),
  user: getUser(state, props),
});

const mapDispatchToProps = {
  createPublicLink,
  deletePublicLink,
  createDashboardSecret,
  createCardSecret,
  updateEnableEmbedding,
  updateEmbeddingParams,
};

const ShareModal = ({
  onClose,
  resource,
  isAdmin,
  isPublicSharingEnabled,
  onAfterChangePublicUuid,
  user,
}) => {
  const {
    open,
    public_uuid,
    type,
    name,
    id,
    creatorId,
    uniqueName,
    creator,
    onlyEmbed,
  } = resource;

  const [uuid, setUuid] = useState("");
  // const [secret, setSecret] = useState(undefined);

  const isOwner = user && (user.id === creatorId || user.is_superuser);

  const { search } = browserHistory.getCurrentLocation();

  // const [removeWatermarkEnabled, setRemoveWatermarkEnabled] = useState(
  //   undefined,
  // );
  // const isShowCancelWatermarkSwitch = secret;

  // const channel =
  //   user && user.invitationCode ? `u-${user.invitationCode}` : undefined;

  useEffect(() => {
    setUuid(public_uuid);
  }, [public_uuid]);

  /*  const secretApi = async (id, resourceType) => {
    let secretApi;
    if (resourceType === "dashboard") {
      secretApi = createDashboardSecret({ id });
    } else {
      secretApi = createCardSecret({ id });
    }
    const { payload } = await secretApi;
    const result = await payload;
    if (result && result?.secret) {
      setSecret(result.secret);
    }
  };*/

  /*  useEffect(() => {
    const { id, type } = resource;
    const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
    const isAdmin = user && user.is_superuser;
    if (id && type && (isPaidUser || isAdmin)) {
      secretApi(id, type);
    }
  }, [user, resource]);*/

  /*  useEffect(() => {
    const initRemoveWatermarkEnabled = () => {
      const enabled =
        localStorage.getItem("user-remove-watermark-enabled") || "true";
      setRemoveWatermarkEnabled(enabled === "true");
    };
    if (resource.open) {
      initRemoveWatermarkEnabled();
    } else {
      setSecret(undefined);
    }
  }, [resource.open]);*/

  useEffect(() => {
    if (open) {
      const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
      if (isAdmin) {
        trackStructEvent(`click share-modal-page-isAdmin`);
      } else if (isPaidUser) {
        trackStructEvent(`click share-modal-page-isPaidUser`);
      } else {
        trackStructEvent(`click share-modal-page-free`);
      }
    }
  }, [user, open, isAdmin]);

  const onCreatePublicLinkAction = async () => {
    const { uuid } =
      type === "dashboard"
        ? await createDashboardPublicLink(id)
        : await createCardPublicLink(id);
    setUuid(uuid);
    onAfterChangePublicUuid &&
      onAfterChangePublicUuid({ newUuid: uuid, id, type });

    /*    if (id && type) {
      secretApi(id, type);
    }*/
  };

  const createDashboardPublicLink = async id => {
    return await DashboardApi.createPublicLink({ id });
  };

  const createCardPublicLink = async id => {
    return await CardApi.createPublicLink({ id });
  };

  const onDisablePublicLinkAction = async () => {
    if (type === "dashboard") {
      DashboardApi.deletePublicLink({ id });
    } else if (type === "card") {
      CardApi.deletePublicLink({ id });
    }
    setUuid(undefined);
    onAfterChangePublicUuid &&
      onAfterChangePublicUuid({ newUuid: undefined, id, type });

    /*    if (id && type) {
      secretApi(id, type);
    }*/
  };

  /*  const cancelWatermarkCheckChange = checked => {
    setRemoveWatermarkEnabled(checked);
    localStorage.setItem("user-remove-watermark-enabled", checked);
  };*/

  return open ? (
    <Modal>
      <ModalContent
        title={onlyEmbed ? "Embed Widget" : "Share"}
        onClose={onClose}
        fullPageModal={true}
      >
        <Flex flexDirection="column">
          <SharingPane
            // isShowCancelWatermarkSwitch={isShowCancelWatermarkSwitch}
            // cancelWatermarkCheckChange={cancelWatermarkCheckChange}
            // cancelWatermarkEnabled={removeWatermarkEnabled}
            getPublicUrl={({ public_uuid, type, name }) => {
              if (type === "dashboard") {
                return Urls.publicDashboard({
                  uuid: public_uuid,
                  name,
                  search,
                  // options: { secret: removeWatermarkEnabled ? secret : "" },
                });
              } else if (type === "card") {
                return Urls.publicQuestion({
                  uuid: public_uuid,
                  name,
                  search,
                  // options: { secret: removeWatermarkEnabled ? secret : "" },
                });
              } else {
                return "";
              }
            }}
            getGuestUrl={({ id, public_uuid, type, uniqueName, creator }) => {
              if (type === "dashboard") {
                return Urls.guestDashboard({
                  uuid: public_uuid,
                  uniqueName: uniqueName,
                  creator: creator,
                  name,
                  search:
                    location.pathname === "/dashboards" ||
                    location.pathname === "/search"
                      ? ""
                      : search,
                  // options: { secret: removeWatermarkEnabled ? secret : "" },
                });
              } else if (type === "card") {
                return Urls.generalQuestion({
                  name,
                  id,
                  search: search,
                });
              } else {
                return "";
              }
            }}
            isAdmin={isAdmin}
            user={user}
            sharePage="share-modal"
            isPublicSharingEnabled={isPublicSharingEnabled && isOwner}
            onCreatePublicLink={onCreatePublicLinkAction}
            onDisablePublicLink={onDisablePublicLinkAction}
            resource={{
              public_uuid: uuid,
              type,
              name,
              uniqueName,
              creator,
              id,
            }}
            onlyEmbed={onlyEmbed}
          />
        </Flex>
      </ModalContent>
    </Modal>
  ) : (
    <React.Fragment />
  );
};

ShareModal.propTypes = {
  onClose: PropTypes.func,
  resource: PropTypes.object,
  isAdmin: PropTypes.bool,
  isPublicSharingEnabled: PropTypes.bool,
  user: PropTypes.object,
  onAfterChangePublicUuid: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
