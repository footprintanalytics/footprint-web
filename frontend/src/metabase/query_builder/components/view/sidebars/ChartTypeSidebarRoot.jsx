/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import { getUserAdvancedChartingPermission } from "metabase/selectors/user";
import ChartTypeSidebar from "metabase/query_builder/components/view/sidebars/ChartTypeSidebar";
import ChartSettingsSidebar from "metabase/query_builder/components/view/sidebars/ChartSettingsSidebar";

const ChartTypeSidebarRoot = ({
  onCloseChartType,
  onCloseChartSettings,
  isShowingChartTypeSidebar,
  isShowingChartSettingsSidebar,
  ...props
}) => {
  const [categoryList, setCategoryList] = useState([
    {
      value: "visualization",
      title: "Visualization",
      selected: true,
    },
    {
      value: "setting",
      title: "Setting",
    },
  ]);

  const categoryListSelect = category => {
    if (category.value === "visualization") {
      props.onOpenChartType();
    } else {
      props.onOpenChartSettings();
    }
  };

  useEffect(() => {
    setCategoryList(
      categoryList.map(item => {
        return {
          ...item,
          selected:
            (isShowingChartTypeSidebar && item.value === "visualization") ||
            (isShowingChartSettingsSidebar && item.value === "setting"),
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowingChartTypeSidebar, isShowingChartSettingsSidebar]);

  return (
    <SidebarContent
      className="full-height"
      categoryList={categoryList}
      categoryListSelect={categoryListSelect}
      onDone={onCloseChartType}
    >
      {categoryList.find(item => item.selected).value === "visualization" && (
        <ChartTypeSidebar {...props} />
      )}
      {categoryList.find(item => item.selected).value === "setting" && (
        <ChartSettingsSidebar {...props} onClose={onCloseChartType} />
      )}
    </SidebarContent>
  );
};

const mapStateToProps = state => ({
  canUse: getUserAdvancedChartingPermission(state),
});

export default connect(mapStateToProps)(ChartTypeSidebarRoot);
