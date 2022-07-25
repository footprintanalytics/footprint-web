/* eslint-disable react/prop-types */
import React from "react";
import ModalContent from "metabase/components/ModalContent";
import Modal from "metabase/components/Modal";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";

const EditUserTagModal = props => {
  const { item, onClose, user } = props;
  const isMarket = user && user.isMarket;
  const isAdmin = user && user.is_superuser;
  console.log("user", user, isMarket, isAdmin);
  return (
    <Modal>
      <ModalContent onClose={onClose} className="user-upgrade-model__root">
        <div>Name: {item?.name}</div>
        <div>Email: {item?.email}</div>
        <div className="mt1" />
        <TagsPanel
          tagEntityId={item?.id}
          isEditPermission={isMarket || isAdmin}
          type="user"
          showSkeleton={true}
          canClick={false}
        />
      </ModalContent>
    </Modal>
  );
};

export default EditUserTagModal;
