/* eslint-disable react/prop-types */
import React from "react";

import ChartSettings from "metabase/visualizations/components/ChartSettings";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import "./ChartSidebar.css";

export default class ChartSettingsSidebar extends React.Component {
  state = { sidebarPropsOverride: null };

  setSidebarPropsOverride = sidebarPropsOverride =>
    this.setState({ sidebarPropsOverride });

  render() {
    const {
      question,
      result,
      addField,
      initialChartSetting,
      onReplaceAllVisualizationSettings,
      onClose,
      // onOpenChartType,
    } = this.props;
    const { sidebarPropsOverride } = this.state;
    return (
      result && (
        <SidebarContent
          className="full-height chart-side-bar__char-setting"
          // title={t`${visualizations.get(question.display()).uiName} options`}
          // onDone={onClose}
          // onBack={onOpenChartType}
          {...sidebarPropsOverride}
        >
          <ChartSettings
            question={question}
            addField={addField}
            series={[
              {
                card: question.card(),
                data: result.data,
              },
            ]}
            onChange={onReplaceAllVisualizationSettings}
            onClose={onClose}
            noPreview
            initial={initialChartSetting}
            setSidebarPropsOverride={this.setSidebarPropsOverride}
          />
        </SidebarContent>
      )
    );
  }
}
