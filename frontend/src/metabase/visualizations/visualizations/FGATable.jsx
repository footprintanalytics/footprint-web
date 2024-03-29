/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import Table from "./Table";

export default class FGATable extends Table {
  static uiName = t`Activation Table`;
  static identifier = "fgatable";
  static iconName = "table";

  static settings = {
    ...super.settings,
    "table.create_cohort": {
      section: t`Columns`,
      title: t`Create segment`,
      widget: "toggle",
      getDefault: () => false,
    },
    "table.create_filter_cohort": {
      section: t`Columns`,
      title: t`Create filter segment`,
      widget: "toggle",
      getDefault: () => false,
    },
    "table.create_campaign": {
      section: t`Columns`,
      title: t`Create activation`,
      widget: "toggle",
      getDefault: () => false,
    },
  };
}
