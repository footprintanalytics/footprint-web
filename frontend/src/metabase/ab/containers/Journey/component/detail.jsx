/* eslint-disable react/prop-types */
import React from "react";
import { Button, Skeleton, Table, message } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import HistoryChart from "metabase/ab/containers/Journey/component/HistoryChart";
import { useQuery } from "react-query";
import { journeyPathUserDetail, journeyPathUserTrend } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import Link from "metabase/core/components/Link";
import {getFgaProject} from "metabase/selectors/user";
import {connect} from "react-redux";

const Detail = props => {
  const { router, nodeDetail, projectObject } = props;
  const projectName = projectObject.protocolSlug;
  const params = {
    "eventNames": ["login", "play_games", "close_app"],
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
      const demoData = [
        {
          "user_id": "user_id_1",
          "uuid": "uuid_1",
          "wallet_address": "0xb290a2bdd6550091d1b1d5398c5b8ae1626289e1"
        },
        {
          "user_id": "user_id_3",
          "uuid": "uuid_3",
          "wallet_address": "0xa5ddb19f19468a2e39e31e885d9d358420bf7b81",
        },
      ];
      return demoData;
      // return await journeyPathUserDetail(params);
    },
    { ...QUERY_OPTIONS, enabled: !!nodeDetail?.id },
  );

  const detailTrend = useQuery(
    ["journeyPathUserTrend", params],
    async () => {
      const demoData = [
        {
          "event_date": "2023-07-02",
          "value": 5
        },
        {
          "event_date": "2023-07-03",
          "value": 5
        },
        {
          "event_date": "2023-07-04",
          "value": 1
        },
        {
          "event_date": "2023-07-07",
          "value": 1
        },
        {
          "event_date": "2023-07-08",
          "value": 4
        },
        {
          "event_date": "2023-07-12",
          "value": 4
        }
      ];
      return demoData;
      // return await journeyPathUserTrend(params);
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
            <Link onClick={() => {
              const hide = message.loading('Generating cohort ...');
              setTimeout(() => {
                hide();
                router?.push(`/fga/public-chain/project/${projectName}/segment`);
              }, 2000);
            }}><Button icon={<SearchOutlined />}>Analyse Cohort</Button></Link>
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
        title: 'UUID',
        dataIndex: 'uuid',
        key: 'uuid',
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

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(Detail);
