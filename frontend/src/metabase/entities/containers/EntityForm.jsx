/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import LegacyForm from "metabase/containers/Form";
import Form from "metabase/containers/FormikForm";
import ModalContent from "metabase/components/ModalContent";

import entityType from "./EntityType";
import { getPersonalCollectionId } from "metabase/lib/collection";

export function getForm(entityDef) {
  // 1. default `form`
  // 2. first of the named `forms`
  return entityDef.form || Object.values(entityDef.forms)[0];
}

const EForm = ({
  entityDef,
  entityObject,
  form = getForm(entityDef),
  update,
  create,
  onBeforeSubmit,
  user,
  // defaults to `create` or `update` (if an id is present)
  onSubmit = async object => {
   if (onBeforeSubmit) {
     const next = await onBeforeSubmit();
     if (!next) {
       throw { data: "" };
     }
   }
   const publicAnalyticPermission =
     user && user.publicAnalytic === "write";
   if (user && !publicAnalyticPermission) {
     object.collection_id = getPersonalCollectionId(user);
   }
   object.create_method = "self";
   return object.id ? update(object) : create(object);
  },
  onClose,
  modal,
  title,
  onSaved,
  useLegacyForm,
  ...props
}) => {
  console.log("xxx")
  if (useLegacyForm) {
    return (
      <LegacyForm
        {...props}
        form={form}
        initialValues={entityObject}
        onSubmit={onSubmit}
        onSubmitSuccess={action => onSaved && onSaved(action.payload.object)}
      />
    );
  }

  return (
    <Form
      {...props}
      form={form}
      initialValues={
        typeof entityObject?.getPlainObject === "function"
          ? entityObject.getPlainObject()
          : entityObject
      }
      onSubmit={onSubmit}
      onSubmitSuccess={action => onSaved && onSaved(action.payload.object)}
    />
  );
};

const Modal = ({
  children,
  title: titleProp,
  entityDef,
  entityObject,
  onClose,
}) => {
  const parseTitleFromEntity = () =>
    entityObject?.id
      ? entityDef.objectSelectors.getName(entityObject)
      : t`New ${entityDef.displayNameOne}`;

  const title = titleProp || parseTitleFromEntity();

  return (
    <ModalContent title={title} onClose={onClose}>
      {children}
    </ModalContent>
  );
};

class EntityForm extends React.Component {
  render() {
    const { modal, ...props } = this.props;

    if (modal) {
      return (
        <Modal {...this.props}>
          <EForm {...props} isModal />
        </Modal>
      );
    } else {
      return <EForm {...props} />;
    }
  }
}

export default entityType()(EntityForm);
