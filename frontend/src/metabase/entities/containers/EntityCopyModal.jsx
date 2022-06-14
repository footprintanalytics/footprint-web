/* eslint-disable react/prop-types */
import React from "react";
import { dissoc } from "icepick";
import { t } from "ttag";

import EntityForm from "metabase/entities/containers/EntityForm";
import ModalContent from "metabase/components/ModalContent";

const EntityCopyModal = ({
  entityType,
  entityObject,
  copy,
  onClose,
  onSaved,
  ...props
}) => (
  <ModalContent
    title={
      entityObject.name
        ? entityObject.name + " - " + t`Duplicate`
        : t`Duplicate`
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
          ? entityObject.name + " - " + t`Duplicate`
          : t`Duplicate`,
      }}
      onSubmit={copy}
      onClose={onClose}
      onSaved={onSaved}
      submitTitle={t`Duplicate`}
      {...props}
    />
  </ModalContent>
);

export default EntityCopyModal;
