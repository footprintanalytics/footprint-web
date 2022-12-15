/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import NameColumns from "./NameColumns";
import FormulaColumns from "./FormulaColumns";
import { Button } from "antd";

const Table = ({ dataset, running, query, executeRes, onChange, onError }) => {
  const tableRef = useRef();

  const colsMap = {};
  const customColsMap = {};
  executeRes.table.columns.forEach((c1, i1) => {
    if (dataset.cols[i1]) {
      colsMap[dataset.cols[i1].name] = c1.name;
    } else {
      customColsMap[c1.name] = c1.name;
    }
  });
  dataset.cols.forEach(item => {
    if (
      item.field_ref[0] === "expression" ||
      item.field_ref[0] === "aggregation"
    ) {
      customColsMap[item.name] = item.name;
    }
  });

  const handleChangeColValue = ({ key, value, col }) => {
    const next = { ...executeRes };
    next.table.columns.forEach(item => {
      if (item.id !== col.id) return;
      item[key] = value;
    });
    onChange(next);
  };

  const handleRemoveCol = col => {
    if (running) return;
    const next = { ...executeRes };
    const index = next.table.columns.findIndex(item => item.id === col.id);
    next.table.data.forEach(item => item.splice(index, 1));
    next.table.columns.splice(index, 1);
    onChange(next);
  };

  const handleAddField = () => {
    if (running) return;
    const next = { ...executeRes };
    next.table.data.forEach(item => item.push(""));
    next.table.columns.push({
      name: `column_${next.table.columns.length + 1}`,
      formula: "",
      id: Date.now(),
    });
    onChange(next);
    setTimeout(() => (tableRef.current.scrollLeft = 1000000));
  };

  return (
    <>
      <h3>Data Preview (Top {executeRes.table.data.length} rows shown)</h3>
      <div className="buffet__table-wrap">
        <table className="buffet__table" ref={tableRef}>
          <thead>
            <tr>
              <NameColumns
                dataset={dataset}
                executeRes={executeRes}
                onChange={(value, col) => {
                  handleChangeColValue({ key: "name", value, col });
                }}
                onRemove={handleRemoveCol}
              />
            </tr>
          </thead>
          <tbody>
            <tr>
              <FormulaColumns
                colsMap={colsMap}
                customColsMap={customColsMap}
                query={query}
                executeRes={executeRes}
                onChange={(value, col) => {
                  handleChangeColValue({ key: "formula", value, col });
                }}
                onError={onError}
              />
            </tr>
            {executeRes.table.data.map(row => (
              <tr key={JSON.stringify(row)}>
                {row.map((item, i) => (
                  <td key={JSON.stringify(row) + item + i}>{item}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          type="primary"
          className="buffet__table-add-field"
          icon={<PlusOutlined />}
          onClick={handleAddField}
        >
          Add Column
        </Button>
      </div>
    </>
  );
};

export default Table;
