/* eslint-disable react/prop-types */
import React from "react";
import "../../css/index.css";
import "./index.css";
import { useQuery } from "react-query";
import { Skeleton } from "antd";
import { queryDataset } from "metabase/new-service";

const Total = props => {
  const { sql } = props;
  const params = {
    "database": 3,
    "type": "native",
    "native": { "query": sql, "template-tags": {} },
    "parameters": [],
  }
  const { isLoading, data } = useQuery(
    ["queryDataset", params],
    async () => {
      return await queryDataset(params);
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!
        sql,
    },
  );
  if (isLoading) {
    return <Skeleton active />;
  }
  return (
    <>
      {data && <div>
        {`Total: ${data?.rows[0][0]}`}
      </div> }
    </>
  );
};

export default Total;
