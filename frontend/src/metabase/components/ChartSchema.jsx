/* eslint-disable react/prop-types */
import React from "react";
import "./TaggingModal.css";
import { Table } from "antd";

const ChartSchema = ({
  result_metadata,
}) => {
  const metadata = result_metadata?.map(metadata => { return { name: metadata.name, base_type: metadata.base_type }});
  const columns = [
    {
      title: `Field Name (${metadata.length})`,
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Field Type',
      dataIndex: 'base_type',
      width: 100,
    },
  ];
  return (
    <div>
      <div className="text-left mb1">Chart schema</div>
      <Table
        columns={columns}
        dataSource={metadata}
        pagination={false}
        scroll={{
          y: 200,
        }}
      />
    </div>
  );
};

export default React.memo(ChartSchema);
