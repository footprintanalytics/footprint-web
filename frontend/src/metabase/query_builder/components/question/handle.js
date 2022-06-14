import * as Urls from "metabase/lib/urls";
import { getProject } from "metabase/lib/project_info";
import { flatten, flattenDeep } from "lodash";

export const NEW_GUIDE_TABLE = "defi_protocol_daily_stats";
export const NEW_GUIDE_CATEGORY = "defi";

export function handleTableListData(list) {
  return (
    list &&
    list.map(q => {
      return {
        ...q,
        tables:
          q.tables &&
          q.tables.map(t => {
            return {
              ...t,
              type: "table",
              originId: t.id,
            };
          }),
        charts:
          q.charts &&
          q.charts.map(t => {
            return {
              ...t,
              type: "chart",
              originId: `card__${t.id}`,
            };
          }),
      };
    })
  );
}

export function handleTableListDataByCategory(list) {
  return (
    list &&
    list.map(q => {
      return {
        ...q,
        type: "table",
        originId: q.id,
      };
    })
  );
}

export function handleNewGuideTableData(list) {
  if (!list) {
    return list;
  }
  const newGuideTableArray = list
    .filter(q => q.tables && q.tables.find(t => t.name === NEW_GUIDE_TABLE))
    .map(q => {
      return {
        ...q,
        tables: q.tables && q.tables.filter(t => t.name === NEW_GUIDE_TABLE),
      };
    });
  return newGuideTableArray.length > 0 ? newGuideTableArray : list;
}

export function isInitHash({ sourceTableId, databaseId }) {
  if (!sourceTableId) {
    return true;
  }
  const url = Urls.newQuestion({
    databaseId,
    tableId: sourceTableId,
    type: "query",
    project: getProject(),
  });
  return url === `/question${location.hash}`;
}

export function getTreeLoadedKeys(list) {
  if (!list) {
    return [];
  }
  const second = flatten(
    list.map(a =>
      [...a.tables, ...a.charts].map(b => {
        return {
          originId: b.originId,
          category: a.category.value,
        };
      }),
    ),
  ).map(item => `${item.category}-${item.originId}`);
  const third = flattenDeep(
    list.map(a =>
      [...a.tables, ...a.charts].map(b => {
        return (
          b.columns &&
          b.columns.map(field => {
            return {
              originId: b.originId,
              category: a.category.value,
              name: field.name,
            };
          })
        );
      }),
    ),
  ).map(item => item && `${item.category}-${item.originId}-${item.name}`);
  const first =
    second.length > 0 ? [] : list.map(a => a?.category?.value || "");
  return [...first, ...second, ...third];
}

export function getAddTableTreeLoadedKeys(key, list) {
  if (!list) {
    return [];
  }
  const second = flatten(
    list.map(b => {
      return {
        originId: b.originId,
        category: key,
      };
    }),
  ).map(item => `${item.category}-${item.originId}`);
  return [...second];
}
