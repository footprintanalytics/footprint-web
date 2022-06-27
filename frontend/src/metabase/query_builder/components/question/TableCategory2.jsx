/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { getProject } from "metabase/lib/project_info";
import { Select, Skeleton } from "antd";
import { useQuery } from "react-query";
import { fetchTableCategory } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";

const TableCategory2 = props => {
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
  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data?.list) {
    return null;
  }

  const getList = list => {
    // const categories = [
    //   "gamefi",
    //   "nft",
    //   "defi",
    //   "protocol",
    //   "token",
    //   "address",
    //   "personal upload",
    //   "Custom Upload",
    //   "My Charts",
    // ];
    // return list?.filter(dataSet => {
    //   return categories.includes(dataSet.value);
    // });
    return list;
  };
  return (
    <div className="flex flex-column">
      <span
        className="footprint-title2"
        style={{ marginLeft: 8, marginBottom: 4 }}
      >
        Select a domain to quickly find the table
      </span>
      {getList(data.list).map(n => (
        <div
          className="footprint-primary-text p1 cursor-pointer"
          key={`${n.value}-${n.label}`}
          value={n.value}
          onClick={() => onChange(n.value)}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
};

export default React.memo(TableCategory2);
