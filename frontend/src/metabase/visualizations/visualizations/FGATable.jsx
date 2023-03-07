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
    "table.create_cohort": {
      section: t`Columns`,
      title: t`Create cohort`,
      widget: "toggle",
      getDefault: () => true,
    },
    "table.send_email": {
      section: t`Columns`,
      title: t`Send email`,
      widget: "toggle",
      getDefault: () => true,
    }
  }

}
