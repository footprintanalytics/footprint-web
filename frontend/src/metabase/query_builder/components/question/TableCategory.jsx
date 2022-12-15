/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { getProject } from "metabase/lib/project_info";
import { Select } from "antd";
import { useQuery } from "react-query";
import { fetchTableCategory } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";

const TableCategory = props => {
  const { databaseId, categoryChange, category } = props;
  const params = {
    databaseId: databaseId,
    project: getProject(),
  };

  const { isLoading, data } = useQuery(
    ["fetchTableCategory", databaseId],
    async () => {
      return await fetchTableCategory(params);
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    categoryChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseId]);

  const onChange = value => {
    categoryChange && categoryChange(value);
  };

  if (!data?.list || isLoading) {
    return null;
  }
  return (
    <Select
      className="question-side__search"
      allowClear
      value={category}
      placeholder="Select category"
      defaultValue="all"
      onChange={onChange}
    >
      {data.list.map(n => (
        <Select.Option key={`${n.value}-${n.label}`} value={n.value}>
          {n.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default React.memo(TableCategory);
