/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Tabs } from "antd";
import TableDataList from "metabase/query_builder/components/question/TableDataList";


function QuestionSideTab({
   level,
   setLevel,
   pageSize,
   isLoading,
   isFeature,
   dataSets,
   isEditing,
   handleSelectTable,
   setShowPreviewChart,
   closeTemplateData,
   databaseId,
   databaseName,
   formDataSelector,
   sourceTableId,
   isTooMore,
   user,
   searchKeyValue,
   qs,
   isByCategory,
   isNewQuestion,
   setShowNewGuideStart,
   setColumnDataMap,
}) {
  const tabInfos = [
    { tab: " All ", key: "all" },
    { tab: "Gold", key: "gold" },
    { tab: "Silver", key: "silver" },
    { tab: "Bronze", key: "bronze" },
    { tab: "Community", key: "community" },
  ];

  const updateColumnsData = data => {
    setColumnDataMap(origin => { return { ...origin, ...data } });
  }

  return (
    <div className="overflow-auto" style={{ flex: 1, marginLeft: 10 }}>
      <Tabs
        tabBarGutter={20}
        defaultActiveKey={tabInfos[0].key}
        destroyInactiveTabPane
        className="flex-full"
        activeKey={level}
        moreIcon={<div />}
        centered
        tabBarUnderlineStyle={{ transform: "scaleX(0.9)" }}
        tabBarExtraContent={<div />}
        onChange={activeKey => {
          setLevel(activeKey);
        }}
      >
        {tabInfos.map(tabInfo => {
          return (
            <Tabs.TabPane tab={tabInfo.tab} key={tabInfo.key}>
              <TableDataList
                isLoading={isLoading}
                isFeature={isFeature}
                dataSets={dataSets}
                isEditing={isEditing}
                handleSelectTable={handleSelectTable}
                setShowPreviewChart={setShowPreviewChart}
                closeTemplateData={closeTemplateData}
                databaseId={databaseId}
                databaseName={databaseName}
                formDataSelector={formDataSelector}
                sourceTableId={sourceTableId}
                pageSize={pageSize}
                updateColumnsData={updateColumnsData}
                isTooMore={isTooMore}
                user={user}
                searchKeyValue={searchKeyValue}
                qs={qs}
                isByCategory={isByCategory}
                isNewQuestion={isNewQuestion}
                setShowNewGuideStart={setShowNewGuideStart}
              />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

export default memo(QuestionSideTab);
