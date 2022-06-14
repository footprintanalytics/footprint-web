import React, { useState } from "react";
import ExpressionEditorTextfield from "metabase/query_builder/components/expressions/ExpressionEditorTextfield";

const FormulaColumns = ({
  colsMap,
  customColsMap,
  query,
  executeRes,
  onChange,
  onError,
}) => {
  const [expression, setExpression] = useState({});

  return executeRes.table.columns.map(col => {
    const isEdit = col.formula !== undefined;
    return (
      <td key={col.id} className={isEdit ? "buffet__table--edit-td" : ""}>
        {isEdit ? (
          <ExpressionEditorTextfield
            fixedWidth="900px"
            mode="python"
            colsMap={colsMap}
            customColsMap={customColsMap}
            expression={expression[col.id] || null}
            query={query.setSourceQuery(query._structuredDatasetQuery.query)}
            onChange={value => {
              setExpression(prev => ({ ...prev, [col.id]: value }));
              onError(null);
            }}
            onValueChange={value => {
              onChange(value, col);
              onError(null);
            }}
            onError={onError}
          />
        ) : (
          "-"
        )}
      </td>
    );
  });
};

export default FormulaColumns;
