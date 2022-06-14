export const updateNativeEditorSelect = ({
  databaseId,
  // databaseName,
  tableName,
  columnName,
  query,
  question,
  nativeEditorCursorOffset,
  nativeEditorSelectedText,
}) => {
  const selectionStart =
    nativeEditorCursorOffset - (nativeEditorSelectedText || "").length;
  const queryColumnText = columnName ? `.\`${columnName}\`` : "";
  const queryText =
    query.queryText().trim() === ""
      ? `select * from \`${tableName}\`${queryColumnText} limit 10;`
      : query.queryText().slice(0, selectionStart) +
        `\`${tableName}\`${queryColumnText}` +
        query.queryText().slice(nativeEditorCursorOffset);

  const nativeQuery = {
    type: "native",
    native: { query: queryText },
    database: databaseId,
  };

  question.setDatasetQuery(nativeQuery).update();
  window._editor && window._editor.focus();
};
