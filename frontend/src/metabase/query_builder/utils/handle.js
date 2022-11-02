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
  // const queryRef = databaseId !== 0 ? '"' : "`";
  const queryRef = "`";
  const selectionStart =
    nativeEditorCursorOffset - (nativeEditorSelectedText || "").length;
  const queryColumnText = columnName
    ? `.${queryRef}${columnName}${queryRef}`
    : "";
  const queryText =
    query.queryText().trim() === ""
      ? `select * from ${queryRef}${tableName}${queryRef} ${queryColumnText} limit 10`
      : query.queryText().slice(0, selectionStart) +
        `${queryRef}${tableName}${queryRef}${queryColumnText}` +
        query.queryText().slice(nativeEditorCursorOffset);

  const nativeQuery = {
    type: "native",
    native: { query: queryText },
    database: databaseId,
  };

  question.setDatasetQuery(nativeQuery).update();
  window._editor && window._editor.focus();
};
