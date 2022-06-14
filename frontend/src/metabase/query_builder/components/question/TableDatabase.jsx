/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { get } from "lodash";
import * as Urls from "metabase/lib/urls";
import { isDefi360 } from "metabase/lib/project_info";
import { Select } from "antd";

const TableDatabase = props => {
  const {
    setDatabaseId,
    card,
    replace,
    databases,
    isEditing,
    databaseId,
  } = props;
  const onChange = value => {
    setDatabaseId(value);
    if (get(card, "dataset_query.type") === "native") {
      replace(Urls.newQuestion({ databaseId: value, type: "native" }));
    } else {
      replace(`/chart?dbId=${value}`);
    }
  };

  if (isDefi360()) {
    return null;
  }

  if (!databases || databases.length < 2) {
    return null;
  }

  return (
    <Select
      disabled={!!isEditing}
      style={{ width: "100%", marginBottom: "15px" }}
      showSearch={databases.length > 1}
      placeholder="Select Database"
      defaultValue={databaseId}
      onChange={onChange}
      filterOption={(input, option) =>
        option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {databases.map(n => (
        <Select.Option key={`${n.id}-${n.name}`} value={n.id}>
          {n.name}
        </Select.Option>
      ))}
    </Select>
  );
};
export default TableDatabase;
