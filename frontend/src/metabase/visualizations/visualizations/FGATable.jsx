/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import Table from "./Table";

export default class FGATable extends Table {
  static uiName = t`FGATable`;
  static identifier = "fgatable";
  static iconName = "table";

  static settings = {
    ...super.settings,
    "table.create_filter_cohort": {
      section: t`Columns`,
      title: t`Create filter cohort`,
      widget: "toggle",
      getDefault: () => false,
    },
    "table.create_upload_cohort": {
      section: t`Columns`,
      title: t`Create upload cohort`,
      widget: "toggle",
      getDefault: () => false,
    },
    "table.create_campaign": {
      section: t`Columns`,
      title: t`Create Campaign`,
      widget: "toggle",
      getDefault: () => false,
    },
    "table.all_user": {
      section: t`Columns`,
      title: t`All Users`,
      widget: "toggle",
      getDefault: () => false,
    },
  };
}
