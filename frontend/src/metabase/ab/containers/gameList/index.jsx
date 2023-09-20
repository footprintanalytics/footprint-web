/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";
import {connect} from "react-redux";
import {Input, message, Skeleton, Space, Table} from "antd";
import {getFgaProject, getUser} from "metabase/selectors/user";
import {useQuery} from "react-query";
import {QUERY_OPTIONS} from "metabase/containers/dashboards/shared/config";
import Link from "metabase/core/components/Link/Link";
import Icon from "metabase/components/Icon";
import { loadCurrentFgaProject } from "metabase/redux/user";
import { setGames, setHistoryGames } from "metabase/redux/control";
import { getGamesByRedux } from "metabase/selectors/control";
const { Search } = Input;

const projectList = props => {
  const { router, location, children, user, projectPath, menu, projectObject, games, setGames, loadCurrentFgaProject } =
    props;
  const userId = 158;
  const projectId = 153;
  console.log("projectObject", projectObject)
  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });

  const params = {
    ecosystemId: 415,
  };
  const data = [
    {
      "id": 154,
      "protocolSlug": "mocaverse",
      "protocolName": "Mocaverse",
      "chain": "BNB Chain, Polygon",
      "Active Users": 3234,
      "icon": "https://i.seadn.io/gcs/files/649cd263c9518915328df38b2db1a6f3.png?auto=format&w=256"
    },
    {
      "id": 157,
      "protocolSlug": "TorqueSquad",
      "protocolName": "TorqueSquad",
      "chain": "BNB Chain, Polygon",
      "Active Users": 1000,
      "icon": "https://footprint-imgs.oss-us-east-1.aliyuncs.com/logo_images/torque-squad.png"
    },
  ];
  const loadProjectDetail = project_id => {
    loadCurrentFgaProject(parseInt(project_id));
  };
  const columns = [
    {
      title: 'Protocol Name',
      dataIndex: 'protocolName',
      key: 'protocolName',
      render: (_, record) => (
        <a className="text-underline text-underline-hover" onClick={async () => {
          await loadProjectDetail(record.id);
          router.replace(`/fga/project/${record.protocolName}/project_health`)
        }}>
          {record.protocolName}
        </a>
      ),
    },
    {
      title: 'chain',
      dataIndex: 'chain',
      key: 'chain',
    },
    {
      title: 'Active Users',
      dataIndex: 'Active Users',
      key: 'Active Users',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link ></Link>
          <a onClick={() => {
            const hide = message.loading("Claim game...", 20000);
            setTimeout(async () => {
              hide();
              setGames([...games, record.protocolName])
              await loadProjectDetail(record.id);
              router.replace(`/fga/project/${record.protocolName}/project_health`)
            }, 2000)
          }}>
            Claim game
          </a>
        </Space>
      ),
    },
  ];


  return (
    <div className="flex flex-column items-center py4">
      {/*{!projectObject && (
        <div className="flex flex-column align-center" style={{ marginTop: 60 }}>
          <h1>Welcome to GA Tool, first you have to add a game.</h1>
          <Button
            style={{ width: 100, marginTop: 40 }}
            onClick={() => {
            setSubmitModalOpen({ open: true, param: null });
            // postProjectApi();
          }}>
            Add Game
          </Button>
        </div>
      )}*/}
      {projectObject && (
        <div style={{ width: 800 }}>
          <div className="flex">
            <h2>Games</h2>
          </div>
          {/*<div className="flex justify-end full-width mb1">
            <Button onClick={() => {
              setSubmitModalOpen({ open: true, param: null });
              // postProjectApi();
            }}>
              Add Game
            </Button>
          </div>*/}
          <div className="flex justify-end">
            <Search
              placeholder="search game"
              allowClear
              enterButton="Search"
              style={{ width: 200, margin: "4px 0" }}
            />
          </div>
          <Table dataSource={data} columns={columns}/>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  setGames: setGames,
  loadCurrentFgaProject,
};
const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    games: getGamesByRedux(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(projectList);
