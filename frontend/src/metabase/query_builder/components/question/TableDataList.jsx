/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Skeleton, Tree } from "antd";
import { DownOutlined } from "metabase/lib/ant-icon";
import Icon from "metabase/components/Icon";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import { personalSaveIndicator } from "metabase/new-service";
import { canShowNewGuideStart } from "metabase/containers/newguide/newGuide";
import { getProject } from "metabase/lib/project_info";
import Highlighter from "react-highlight-words";
import { getSearchTexts } from "metabase/nav/components/utils";
import { flatten, flattenDeep } from "lodash";
import {
  getTreeLoadedKeys,
  NEW_GUIDE_CATEGORY,
} from "metabase/query_builder/components/question/handle";

const TableDataList = props => {
  const {
    isLoading,
    isFeature,
    dataSets,
    isEditing,
    handleSelectTable,
    setShowPreviewChart,
    closeTemplateData,
    databaseId,
    databases,
    formDataSelector,
    sourceTableId,
    pageSize,
    updateMoreListData,
    isTooMore,
    user,
    searchKeyValue,
    qs,
    isByCategory,
    isNewQuestion,
    setShowNewGuideStart,
  } = props;

  const canShowNewGuide = canShowNewGuideStart(user);

  const [firstShowNewGuideStart, setFirstShowNewGuideStart] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const searchWords =
    searchKeyValue?.length > 0 ? getSearchTexts(searchKeyValue) : [];
  const [treeLoadedKeys, setTreeLoadedKeys] = useState([]);

  const showLine = { showLeafIcon: false };
  useEffect(() => {
    if (qs && dataSets?.length > 0) {
      if (!isByCategory) {
        setExpandedKeys([
          ...flatten(dataSets.map(item => item.category.value)),
          ...flattenDeep(
            dataSets.map(
              item =>
                item.tables &&
                item.tables.map(table => `${item.category.value}-${table.id}`),
            ),
          ),
        ]);
      } else {
        setExpandedKeys([...flatten(dataSets.map(item => `${item.id}`))]);
      }
    } else {
      // setExpandedKeys([]);
    }
    if (
      isNewQuestion &&
      canShowNewGuide &&
      dataSets?.length > 0 &&
      firstShowNewGuideStart
    ) {
      setFirstShowNewGuideStart(false);
      setExpandedKeys([...expandedKeys, NEW_GUIDE_CATEGORY]);
      setShowNewGuideStart(true);
    }
    if (!isByCategory) {
      setTreeLoadedKeys([...treeLoadedKeys, ...getTreeLoadedKeys(dataSets)]);
    } else {
      setTreeLoadedKeys([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSets]);

  useEffect(() => {
    if (!qs) {
      setExpandedKeys([]);
    }
  }, [qs]);

  if (isLoading) {
    return (
      <div className="flex-full pt1">
        <Skeleton active />
      </div>
    );
  }

  const onExpand = expanded => {
    setExpandedKeys(expanded);
  };

  const keyCanLoadMore = key => {
    return !!(dataSets?.find(a => key === a.category.value) || {}).loadMore;
  };

  const setTreeLoadedKeysAppend = key => {
    setTreeLoadedKeys([...treeLoadedKeys, key]);
  };

  const onLoadData = async props => {
    const { key, children } = props || {};
    try {
      if (children && children.length === 0) {
        if (keyCanLoadMore(key)) {
          await loadMore({ key, current: 1 });
        } else {
          setTreeLoadedKeysAppend(key);
        }
      } else {
        setTreeLoadedKeysAppend(key);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const loadMore = async ({ key, current }) => {
    const { list, total } = await personalSaveIndicator({
      databaseId,
      current,
      pageSize,
      project: getProject(),
    });
    const hasMore = current * pageSize < total;
    let moreData;
    dataSets?.map(dataSet => {
      if (dataSet.category.value === key) {
        moreData = {
          charts: [
            ...dataSet.charts.filter(chart => chart.type !== "more"),
            ...(list &&
              list.map(t => {
                return {
                  ...t,
                  type: "chart",
                  originId: `card__${t.id}`,
                };
              })),
            hasMore
              ? {
                  originId: `more`,
                  type: "more",
                  name: "More",
                  current: current,
                }
              : null,
          ].filter(item => item !== null),
        };
      }
    });
    updateMoreListData({ key, moreData });
  };

  const renderNoData = () => {
    return (
      <div className="question-side-nodata">
        <Icon name="chart_empty" size={30} color={"#84848A"} />
        <span>No results found</span>
      </div>
    );
  };

  const treeChildren = (q, qInx) => {
    const previewAction = (e, data) => {
      MetabaseAnalytics.trackStructEvent("question-side click preview");
      e.stopPropagation();
      e.preventDefault();
      closeTemplateData();
      setShowPreviewChart({
        show: true,
        data: {
          ...data,
          databaseId,
          databaseName: databases.find(f => f.id === databaseId)?.name || "",
        },
      });
    };
    const sets = isByCategory ? q && q : [...q.tables, ...q.charts];
    return sets.map((n, nInx) => {
      const id = n.originId;
      return {
        title: (
          <div
            id={`table-${qInx}-${nInx}`}
            className={cx("flex justify-between align-center table-node", {
              "table-node-selected":
                !isEditing && sourceTableId === id && !formDataSelector,
            })}
            onClick={() => {
              if (n.type === "more") {
                MetabaseAnalytics.trackStructEvent("question-side click more");
                loadMore({ key: q.category.value, current: n.current + 1 });
                return;
              }
              MetabaseAnalytics.trackStructEvent(
                `question-side click category ${n.name}`,
              );
              handleSelectTable({
                tableId: id,
                tableName: n.name,
              });
            }}
          >
            {n.type === "more" ? (
              <Button className="table-node-more" loading={n.loading}>
                More
              </Button>
            ) : (
              <Highlighter
                className="table-node-title"
                highlightClassName="highlight"
                searchWords={searchWords}
                autoEscape={true}
                textToHighlight={n.name}
              />
            )}

            {n.type !== "more" && !canShowNewGuide && (
              <Button
                className="question-side__preview"
                onClick={e => previewAction(e, n)}
              >
                Preview
              </Button>
            )}
          </div>
        ),
        key: isByCategory ? `${id}` : `${q.category.value}-${id}`,
        selectable: false,
        children: treeColumnsChildren({ q, n, id }),
      };
    });
  };

  const treeColumnsChildren = ({ q, n, id }) => {
    return (
      n.columns &&
      n.columns.map(field => ({
        title: (
          <Tooltip key="download-dashboard" tooltip={field.description || ""}>
            <span
              onClick={() => {
                MetabaseAnalytics.trackStructEvent(
                  `question-side click item ${n.name} ${field.name}`,
                );
                handleSelectTable({
                  tableId: id,
                  tableName: n.name,
                  columnName: field.name,
                });
              }}
            >
              <Highlighter
                highlightClassName="highlight"
                searchWords={searchWords}
                autoEscape={true}
                textToHighlight={field.name}
              />
              {field.database_type && (
                <span style={{ color: "#949aab", marginLeft: 5 }}>
                  ({field.database_type.toLowerCase()})
                </span>
              )}
              {field.isMatchValue && (
                <span style={{ color: "#3434b2", marginLeft: 5 }}>
                  {field.matchFieldValues?.join(", ")}
                </span>
              )}
            </span>
          </Tooltip>
        ),
        key: isByCategory
          ? `${id}-${field.name}`
          : `${q.category.value}-${id}-${field.name}`,
        selectable: false,
      }))
    );
  };

  const treeData = isByCategory
    ? treeChildren(dataSets, 0)
    : dataSets?.map((q, qInx) => {
        return {
          title: (
            <span
              className="flex justify-between align-center category-title"
              onClick={() => {
                MetabaseAnalytics.trackStructEvent(
                  `question-side click category ${q.category.value}`,
                );
                if (expandedKeys.includes(q.category.value)) {
                  setExpandedKeys([
                    ...expandedKeys.filter(value => value !== q.category.value),
                  ]);
                } else {
                  setExpandedKeys([...expandedKeys, q.category.value]);
                }
              }}
            >
              {q.category.label}
              {/* <Icon name="arrow_double_right" size={16} /> */}
            </span>
          ),
          key: q.category.value,
          selectable: false,
          children: treeChildren(q, qInx),
        };
      });

  const renderTooMoreHint = () => {
    return (
      <div className="question-side__too-more-data">
        <Icon name="sigh" size={20} color={"#FAAD15"} />
        <span>Try to add search keywords to narrow down the results！</span>
      </div>
    );
  };

  return (
    <div className="flex-full">
      {isFeature && renderNoData()}
      {isFeature && dataSets?.length > 0 && (
        <div className="question-side-recommend">Recommend</div>
      )}
      {isTooMore && renderTooMoreHint()}
      {isByCategory ? (
        <Tree
          virtual={true}
          motion={null}
          showLine={showLine}
          showIcon={false}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          defaultExpandAll={!!isEditing}
          loadedKeys={treeLoadedKeys}
        />
      ) : (
        <Tree
          virtual={true}
          motion={null}
          showLine={showLine}
          showIcon={false}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          defaultExpandAll={!!isEditing}
          loadData={onLoadData}
          loadedKeys={treeLoadedKeys}
        />
      )}
    </div>
  );
};
export default React.memo(TableDataList);
