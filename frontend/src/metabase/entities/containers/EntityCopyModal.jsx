/* eslint-disable react/prop-types */
import React from "react";
import { dissoc } from "icepick";
import { t } from "ttag";

import EntityForm from "metabase/entities/containers/EntityForm";
import ModalContent from "metabase/components/ModalContent";
import { connect } from "react-redux";
import { getUser } from "metabase/home/selectors";

const EntityCopyModal = ({
  entityType,
  entityObject,
  copy,
  onClose,
  onSaved,
  user,
  ...props
}) => (
  <ModalContent
    title={
      entityObject.name ? entityObject.name + " - " + user?.name : user?.name
    }
    titleDesc={
      <div style={{ color: "#FFBC4C", fontSize: 12, padding: "8px 0" }}>
        {`Tips: You can view & edit the copied ${
          entityType === "dashboards" ? "dashboard" : "query"
        } in My Analytics`}
      </div>
    }
    onClose={onClose}
  >
    <EntityForm
      entityType={entityType}
      entityObject={{
        ...dissoc(entityObject, "id"),
        name: entityObject.name
          ? entityObject.name + " - " + user?.name
          : user?.name,
      }}
      onSubmit={copy}
      onClose={onClose}
      onSaved={onSaved}
      submitTitle={t`Duplicate`}
      {...props}
    />
  </ModalContent>
);

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

export default connect(mapStateToProps)(EntityCopyModal);
