/* eslint-disable react/prop-types */
import React from "react";
import "./TaggingModal.css";
import { Table } from "antd";

const ChartSchema = ({
  result_metadata,
}) => {
  const metadata = result_metadata?.map(metadata => { return { name: metadata.name, base_type: metadata.base_type.replace(/type\//g, "") }});
  const columns = [
    {
      title: `Field Name (${metadata.length})`,
      dataIndex: 'name',
    },
    {
      title: 'Field Type',
      dataIndex: 'base_type',
      width: 250,
    },
  ];
  return (
    <div style={{ maxHeight: 180, overflow: "auto"}}>
      <Table
        columns={columns}
        dataSource={metadata}
        pagination={false}
        sticky={true}
      />
    </div>
  );
};

export default React.memo(ChartSchema);
