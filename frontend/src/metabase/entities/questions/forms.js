import { t } from "ttag";
import MetabaseSettings from "metabase/lib/settings";
import { PLUGIN_CACHING } from "metabase/plugins";
import { formatDashboardChartSaveTitle } from "metabase/lib/formatting";

const FORM_FIELDS = [
  { name: "name", title: t`Name` },
  {
    name: "description",
    title: t`Description`,
    type: "text",
    placeholder: t`It's optional but oh, so helpful`,
  },
];

export default {
  create: {
    fields: [
      ...FORM_FIELDS,
      {
        name: "collection_id",
        title: t`Collection`,
        type: "collection",
      },
    ],
  },
  edit: {
    fields: () => {
      const fields = [...FORM_FIELDS];
      if (
        MetabaseSettings.get("enable-query-caching") &&
        PLUGIN_CACHING.cacheTTLFormField
      ) {
        fields.push({
          ...PLUGIN_CACHING.cacheTTLFormField,
          title: t`Caching`,
          type: "questionCacheTTL",
        });
      }
      return fields;
    },
  },
  details: {
    fields: [
      {
        name: "name",
        title: t`Name`,
        normalize: name => formatDashboardChartSaveTitle(name),
      },
      {
        name: "description",
        title: t`Description`,
        type: "text",
        placeholder: t`It's optional but oh, so helpful`,
      },
      {
        name: "collection_id",
        title: t`Collection`,
        type: "collection",
      },
    ],
  },
  details_without_collection: {
    fields: [
      {
        name: "name",
        title: t`Name`,
        normalize: name => formatDashboardChartSaveTitle(name),
      },
      {
        name: "description",
        title: t`Description`,
        type: "text",
        placeholder: t`It's optional but oh, so helpful`,
      },
    ],
  },
};
