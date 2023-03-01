import { map, get, intersection } from "lodash";
import { getTableNameListFromSQL } from "metabase/lib/formatting/footprint";
export const isRealtimeChart = (dashcard, realtimeList = []) => {
  const datasetQuery = dashcard.card.dataset_query;
  if (datasetQuery.type === "native") {
    const tableNameList = getTableNameListFromSQL(datasetQuery.native.query);
    const names = realtimeList.map(item => item.tableName).filter(i => i);
    return names.length > 0 && intersection(tableNameList, names);
  } else {
    const tableIds = [...map(get(datasetQuery, 'query.joins'), 'source-table'), get(datasetQuery, 'query.source-table')];
    const ids = realtimeList.map(item => item.tableId).filter(i => i);
    return ids.length > 0 && intersection(tableIds, ids);
  }
};
