/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Icon from "metabase/components/Icon";
import { Table, Tag, Space } from "antd";

const List = props => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Last updated by',
      dataIndex: 'lastUpdatedBy',
      key: 'lastUpdatedBy',
    },
    {
      title: 'Update Time',
      key: 'updateTime',
      dataIndex: 'updateTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a><Icon name="edit_document" size={12} color="white"/></a>
          <a><Icon name="trash" size={12} color="white"/></a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
    {
      key: '2',
      name: 'Jim Green',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
    {
      key: '3',
      name: 'Joe Black',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
  ];
  return (
    <div className="journey-list">
      <div className="flex">
        <Icon name={"collapse_arrow_left"} size={16} color="white"/>
        <h2>Saved Journey</h2>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};


export default List;
