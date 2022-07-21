export default function getBetaTable({ tableId, tableName, tableConfigList }) {
  return (tableId &&
      tableConfigList?.find(
        item => item.id === tableId && item.type === "beta",
      )) ||
    (tableName &&
      tableConfigList?.find(
        item => item.name === tableName && item.type === "beta",
      )
    );
}
