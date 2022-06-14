import React, { Component } from "react";
import { t } from "ttag";

import Ellipsified from "metabase/components/Ellipsified";

import { formatValue } from "metabase/lib/formatting";

import { fieldSetting } from "metabase/visualizations/lib/settings/utils";
import { columnSettings } from "metabase/visualizations/lib/settings/column";

import type { VisualizationProps } from "metabase-types/types/Visualization";

import ScalarValue, {
  ScalarTitle,
  ScalarWrapper,
} from "metabase/visualizations/components/ScalarValue";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class DoubleScalar extends Component {
  props: VisualizationProps;

  static uiName = t`Double Num`;
  static identifier = "doublescalar";
  static iconName = "doubleNumber";

  static noHeader = true;
  static supportsSeries = true;

  static minSize = { width: 3, height: 3 };

  static isSensible = () => true;

  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...fieldSetting("scalar.field", {
      section: t`Data`,
      title: t`Field`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("scalar.fieldSecond", {
      section: t`Data`,
      title: t`FieldSecond`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
  };

  render() {
    const {
      actionButtons,
      isDashboard,
      onChangeCardAndRun,
      series: [
        {
          card,
          data: { cols, rows },
        },
      ],
      settings,
    } = this.props;
    const scalarFieldIndex = cols.findIndex(
      item => item.name === settings["scalar.field"],
    );
    const scalarFieldIndexSecond = cols.findIndex(
      item => item.name === settings["scalar.fieldSecond"],
    );
    const value = rows.length > 0 ? rows[0][scalarFieldIndex] : "";
    const valueSecond = rows.length > 0 ? rows[0][scalarFieldIndexSecond] : "";
    const displayValue = () => {
      if (settings.column && cols[scalarFieldIndex]) {
        return formatValue(value, settings.column(cols[scalarFieldIndex]));
      } else {
        return value;
      }
    };
    const displayValueSecond = () => {
      if (settings.column && cols[scalarFieldIndexSecond]) {
        return formatValue(
          valueSecond,
          settings.column(cols[scalarFieldIndexSecond]),
        );
      } else {
        return valueSecond;
      }
    };
    return (
      <ScalarWrapper>
        <div className="Card-title absolute top right p1 px2">
          {actionButtons}
        </div>
        <div className="full-height full flex-wrap relative">
          {isDashboard && (
            <ScalarTitle
              title={settings["card.title"]}
              description={settings["card.description"]}
              onClick={
                onChangeCardAndRun &&
                (() => onChangeCardAndRun({ nextCard: card }))
              }
            />
          )}
          <Ellipsified
            className="fullscreen-normal-text fullscreen-night-text text-centered full-height full align-center justify-center flex flex-column"
            style={{ maxWidth: "100%" }}
          >
            <ScalarValue value={displayValue()} />
            <ScalarValue value={displayValueSecond()} />
          </Ellipsified>
        </div>
      </ScalarWrapper>
    );
  }
}
