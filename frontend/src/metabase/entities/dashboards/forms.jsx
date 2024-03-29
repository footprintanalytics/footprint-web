import React from "react";
import { t } from "ttag";
import MetabaseSettings from "metabase/lib/settings";
import { PLUGIN_CACHING } from "metabase/plugins";

import DashboardCopyModalShallowCheckboxLabel from "metabase/dashboard/components/DashboardCopyModal/DashboardCopyModalShallowCheckboxLabel";


import validate from "metabase/lib/validate";
import { formatDashboardChartSaveTitle } from "metabase/lib/formatting/footprint";

function createNameField() {
  return {
    name: "name",
    title: t`Name`,
    placeholder: t`What is the name of your dashboard?`,
    autoFocus: true,
    validate: validate.required().checkDashboardTitle(),
    normalize: name => formatDashboardChartSaveTitle(name),
    lightMode: true,
  };
}

function createDescriptionField() {
  return {
    name: "description",
    title: t`Description`,
    type: "text",
    placeholder: t`It's optional but oh, so helpful`,
  };
}

function createCollectionIdField() {
  return {
    name: "collection_id",
    title: t`Which collection should this go in?`,
    type: "collection",
    validate: collectionId =>
      collectionId === undefined ? t`Collection is required` : null,
  };
}

function createShallowCopyField() {
  return {
    name: "is_shallow_copy",
    type: "checkbox",
    label: <DashboardCopyModalShallowCheckboxLabel />,
  };
}

function duplicateForm() {
  return [
    createNameField(),
    createDescriptionField(),
    createCollectionIdField(),
    // createShallowCopyField(),
  ];
}

function userDuplicateForm() {
  return [
    createNameField(),
    createDescriptionField(),
  ];
}

function createForm() {
  return [
    createNameField(),
    createDescriptionField(),
  ];
}

function createFormAdmin() {
  return [
    createNameField(),
    createDescriptionField(),
    createCollectionIdField(),
  ];
}

export default {
  create: {
    fields: createForm,
  },
  create_admin: {
    fields: createFormAdmin,
  },
  duplicate: {
    fields: duplicateForm,
  },
  userDuplicate: {
    fields: userDuplicateForm,
  },
  edit: {
    fields: () => {
      const fields = [...createForm()];
      if (
        MetabaseSettings.get("enable-query-caching") &&
        PLUGIN_CACHING.cacheTTLFormField
      ) {
        fields.push({
          ...PLUGIN_CACHING.cacheTTLFormField,
          type: "dashboardCacheTTL",
          message: t`Cache all question results for`,
        });
      }
      return fields;
    },
  },
  dataAppPage: {
    fields: () => [
      {
        ...createNameField(),
        placeholder: t`What is the name of your page?`,
      },
      createDescriptionField(),
      {
        ...createCollectionIdField(),
        type: "hidden",
      },
      {
        name: "is_app_page",
        type: "hidden",
        initial: true,
        normalize: () => true,
      },
    ],
  },
};
