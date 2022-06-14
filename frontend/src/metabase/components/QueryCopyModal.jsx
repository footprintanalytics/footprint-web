import React, { useState } from "react";
import Modal from "metabase/components/Modal";
import EntityCopyModal from "metabase/entities/containers/EntityCopyModal";
import Questions from "metabase/entities/questions";
import * as Urls from "metabase/lib/urls";
import connect from "react-redux/lib/connect/connect";
import { getUser } from "metabase/home/selectors";
import { push } from "react-router-redux";
import { copyCard } from "metabase/new-service";
import { getPersonalCollectionId } from "metabase/lib/collection";
import { getUserCreateQueryPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getProject } from "metabase/lib/project_info";

const QueryCopyModal = (props: Attributes) => {
  return props.open ? <QueryCopyInnerModal {...props} /> : <React.Fragment />;
};

const QueryCopyInnerModal = ({
  cardId,
  name,
  description,
  onClose,
  user,
  canCreate,
}: Attributes) => {
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
              ? Questions.forms.details
              : Questions.forms.details_without_collection
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
type Attributes = {
  open: boolean,
  cardId: String,
  name: String,
  onClose: Function,
  onChangeLocation: Function,
  canCreate: Boolean,
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
  canCreate: getUserCreateQueryPermission(state),
});

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryCopyModal);
