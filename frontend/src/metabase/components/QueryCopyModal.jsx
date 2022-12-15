import React, { useState } from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import PropTypes from "prop-types";
import Modal from "metabase/components/Modal";
import EntityCopyModal from "metabase/entities/containers/EntityCopyModal";
import Questions from "metabase/entities/questions";
import * as Urls from "metabase/lib/urls";
import { getUser } from "metabase/home/selectors";
import { copyCard } from "metabase/new-service";
import { getPersonalCollectionId } from "metabase/lib/collection";
import { getUserCreateQueryPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getProject } from "metabase/lib/project_info";

const QueryCopyModal = (props) => {
  return props.open ? <QueryCopyInnerModal {...props} /> : <React.Fragment />;
};

const QueryCopyInnerModal = ({
  cardId,
  name,
  description,
  onClose,
  user,
  canCreate,
}) => {
  const publicAnalyticPermission = user && user.publicAnalytic === "write";
  const [showVip, setShowVip] = useState(false);
  return (
    <>
      <Modal onClose={onClose}>
        <EntityCopyModal
          entityType="questions"
          entityObject={{
            name,
            description,
            collection_id: getPersonalCollectionId(user),
          }}
          form={
            publicAnalyticPermission
              ? Questions.forms.createAdmin
              : Questions.forms.create
          }
          copy={async formValues => {
            if (!canCreate) {
              setShowVip(true);
              return;
            }
            const params = {
              collection_position: null,
              ...formValues,
              description: formValues.description || null,
            };
            if (user && !publicAnalyticPermission) {
              params.collection_id = getPersonalCollectionId(user);
            }
            const object = await copyCard({
              cardId: cardId,
              params: { ...params, project: getProject() },
            });
            return { payload: { object } };
          }}
          onClose={onClose}
          onSaved={async card => {
            if (card.id) {
              // onChangeLocation(Urls.question(card));
              window.open(Urls.question(card));
            } else {
              throw card;
            }
            onClose && onClose();
          }}
        />
      </Modal>
      {showVip && (
        <NeedPermissionModal
          title="Your account has reached the limit of number of query, please upgrade the account to unlock more"
          onClose={() => setShowVip(false)}
        />
      )}
    </>
  );
};

QueryCopyModal.propTypes = {
  open: PropTypes.bool,
  cardId: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func,
  onChangeLocation: PropTypes.func,
  canCreate: PropTypes.bool,
  description: PropTypes.string,
  user: PropTypes.object,
};

QueryCopyInnerModal.propTypes = {
  open: PropTypes.bool,
  cardId: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func,
  onChangeLocation: PropTypes.func,
  canCreate: PropTypes.bool,
  description: PropTypes.string,
  user: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
  canCreate: getUserCreateQueryPermission(state),
});

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryCopyModal);
