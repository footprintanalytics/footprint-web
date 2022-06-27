/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { uniq, flatten } from "lodash";

const TableSelect = props => {
  const {
    list,
    placeholder,
    onSelect,
    dataSets,
    category,
    searchKeyValue,
  } = props;
  const [customList, setCustomList] = useState([]);

  useEffect(() => {
    if (category && !searchKeyValue && dataSets) {
      const array = uniq(
        flatten(dataSets?.map(d => d.columns.map(c => c.name))),
      );
      setCustomList(
        array.map((a, index) => {
          return {
            id: index,
            name: a,
          };
        }),
      );
    }
  }, [dataSets, category, searchKeyValue]);

  if (!(list || customList)) {
    return null;
  }
  return (
    <Select
      style={{ width: "100%", marginBottom: "15px" }}
      placeholder={placeholder}
      showSearch
      onChange={value => {
        console.log("value", value);
        onSelect(value);
      }}
      allowClear
    >
      {(list || customList).map(n => (
        <Select.Option key={`${n.id}-${n.name}`} value={n.name}>
          {n.name}
        </Select.Option>
      ))}
    </Select>
  );
};
export default TableSelect;
