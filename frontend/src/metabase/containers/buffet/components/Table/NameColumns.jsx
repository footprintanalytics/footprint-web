import { Input } from "antd";
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
// import { formatTableTitle } from "metabase/lib/formatting";

const NameColumns = ({ dataset, executeRes, onChange, onRemove }) => {
  return executeRes.table.columns.map((col, i) => {
    const isEdit = col.formula !== undefined;
    return (
      <td key={col.id} className={isEdit ? "buffet__table--edit-td" : ""}>
        {isEdit ? (
          <Input
            spellCheck={false}
            defaultValue={col.name}
            onChange={e => onChange(e.target.value, col)}
            addonAfter={
              <CloseOutlined
                style={{ cursor: "pointer" }}
                onClick={() => onRemove(col)}
              />
            }
          />
        ) : (
          col.name
          // formatTableTitle(dataset.cols[i].display_name)
        )}
      </td>
    );
  });
};

export default NameColumns;
