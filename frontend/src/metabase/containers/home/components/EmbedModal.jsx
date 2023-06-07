import React from "react";
import SharingPane from "metabase/public/components/widgets/SharingPane";
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
import { createCardSecret } from "metabase/query_builder/actions";

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

const EmbedModal = ({
  onClose,
  resource,
  isAdmin,
  user,
}) => {
  const {
    open,
  } = resource;

  return open ? (
    <Modal>
      <ModalContent
        title={"Embed Widget"}
        onClose={onClose}
        fullPageModal={true}
      >
        <div className="flex flex-column">
          <SharingPane
            getPublicUrl={({ publicUrl}) => {
              return publicUrl;
            }}
            getGuestUrl={() => {
            }}
            isAdmin={isAdmin}
            user={user}
            sharePage="share-modal"
            isPublicSharingEnabled={true}
            resource={{
              public_uuid: "embed",
              ...resource,
            }}
            onlyEmbed={true}
            iframeWidth={1440}
            iframeHeight={800}
          />
        </div>
      </ModalContent>
    </Modal>
  ) : (
    <React.Fragment />
  );
};

EmbedModal.propTypes = {
  onClose: PropTypes.func,
  resource: PropTypes.object,
  isAdmin: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmbedModal);
