/* eslint-disable react/prop-types */
import React from "react";
import { Button, Skeleton, Table } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import HistoryChart from "metabase/ab/containers/Journey/component/HistoryChart";
import { useQuery } from "react-query";
import { journeyPathUserDetail, journeyPathUserTrend } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";

const Detail = props => {
  const { nodeDetail, } = props;
  const params = {
    "eventNames": ["login", "play_games", "close_app", "purchase", "open_app", "nft_reward"],
    "initialEventName": "login",
    "project": "benji",
    "startTime": "2023-07-01",
    "endTime": "2023-08-01",
    "levelLimit": 6,
    "selectEventId": nodeDetail?.id,
  }

  const detailResult = useQuery(
    ["journeyPathUserDetail", params],
    async () => {
      return await journeyPathUserDetail(params);
    },
    { ...QUERY_OPTIONS, enabled: !!nodeDetail?.id },
  );

  const detailTrend = useQuery(
    ["journeyPathUserTrend", params],
    async () => {
      return await journeyPathUserTrend(params);
    },
    { ...QUERY_OPTIONS, enabled: !!nodeDetail?.id },
  );

  const renderInfo = () => {
    return (
      <div className="journey-detail" style={{color: "white"}}>
        <div className="flex justify-between">
          <div className="flex flex-column">
            <h4>{nodeDetail?.name}</h4>
            <span>{nodeDetail?.value} Sessions</span>
          </div>
          <div className="flex">
            {/*<Button icon={<SearchOutlined />}>Search wallets</Button>*/}
            <Button className="ml1" icon={<DownloadOutlined />}>Export</Button>
          </div>
        </div>
        <HistoryChart data={detailTrend?.data} isLoading={detailTrend?.isLoading}/>
      </div>
    )
  }

  const renderList = () => {

    const columns = [
      {
        title: 'User Id',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: 'Animoca Id',
        dataIndex: 'animoca_id',
        key: 'animoca_id',
      },
      {
        title: 'Wallet',
        dataIndex: 'wallet_address',
        key: 'wallet_address',
      },
    ];
    if (detailResult?.isLoading) {
      return (<div className="full-width" style={{ height: 200 }}><Skeleton active /></div>)
    }
    return (
      <div className="full-width">
        <Table dataSource={detailResult?.data} columns={columns} />
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
