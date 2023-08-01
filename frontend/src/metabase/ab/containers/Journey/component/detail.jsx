/* eslint-disable react/prop-types */
import React from "react";
import { Button, Table } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import HistoryChart from "metabase/ab/containers/Journey/component/HistoryChart";

const Detail = props => {
  const {data} = props;

  const renderInfo = () => {
    return (
      <div className="journey-detail" style={{color: "white"}}>
        <div className="flex justify-between">
          <div className="flex flex-column">
            <span>{data?.name}</span>
            <span>{data?.value} Sessions</span>
          </div>
          <div className="flex">
            <Button icon={<SearchOutlined />}>Search wallets</Button>
            <Button className="ml1" icon={<DownloadOutlined />}>Export</Button>
          </div>
        </div>
        <HistoryChart />
      </div>
    )
  }

  const renderList = () => {
    const dataSource = [
      {
        key: '1',
        wallet: '0xdd',
        duration: 32,
        referrer: 'app.io',
      },
      {
        key: '2',
        wallet: '0xee',
        duration: 42,
        referrer: 'app.io',
      },
      {
        key: '3',
        wallet: '0xee',
        duration: 42,
        referrer: 'app.io',
      },
      {
        key: '4',
        wallet: '0xee',
        duration: 42,
        referrer: 'app.io',
      },
      {
        key: '5',
        wallet: '0xee',
        duration: 42,
        referrer: 'app.io',
      },
    ];

    const columns = [
      {
        title: 'wallet',
        dataIndex: 'wallet',
        key: 'wallet',
      },
      {
        title: 'Session Duration',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: 'Referrer',
        dataIndex: 'referrer',
        key: 'referrer',
      },
    ];


    return (
      <div className="full-width">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    )
  }

  return (
    <div className="flex flex-column items-center" >
      {renderInfo()}
      {renderList()}
    </div>
  );
};


export default Detail;
