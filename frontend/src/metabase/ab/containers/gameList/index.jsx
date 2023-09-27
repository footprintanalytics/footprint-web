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
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import { setGames, setHistoryGames } from "metabase/redux/control";
import { getGamesByRedux } from "metabase/selectors/control";
const { Search } = Input;
import { StarFilled } from '@ant-design/icons';
import { getPublicChainProjects } from "metabase/new-service";

const projectList = props => {
  const { router, location, children, user, projectPath, menu, projectObject, games, setGames, loadCurrentFgaProjectNew, businessType } =
    props;
  const userId = 158;
  const projectId = 153;
  console.log("projectList")
  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });

  const params = {
    ecosystemId: 415,
  };

  const { isLoading, data: data2 } = useQuery(
    ["GetFgaProject", user?.id],
    async () => {
      // const toggle_platform_project = localStorage.getItem('toggle_platform_project')
      // if (toggle_platform_project === "project") {
      //   return {
      //     "data": [
      //     {
      //       "protocolSlug": "Project A",
      //       "protocolName": "Project A",
      //     }
      //     ]
      //   }
      // }
      if (businessType === "public-chain") {
        return await getPublicChainProjects();
      }
      return {
        "data": [
          {
            "id": 154,
            "protocolSlug": "mocaverse",
            "protocolName": "Mocaverse",
            "chain": "BNB Chain, Polygon",
            "Active Users": 3234,
            "Transactions": 223456,
            "icon": "https://i.seadn.io/gcs/files/649cd263c9518915328df38b2db1a6f3.png?auto=format&w=256"
          },
          {
            "id": 157,
            "protocolSlug": "TorqueSquad",
            "protocolName": "TorqueSquad",
            "chain": "BNB Chain, Polygon",
            "Active Users": 1000,
            "Transactions": 88355,
            "icon": "https://footprint-imgs.oss-us-east-1.aliyuncs.com/logo_images/torque-squad.png"
          },
        ]
      }
      // return await getPublicChainProjects();
    },
    QUERY_OPTIONS,
  );

  const data = (businessType === "public-chain") ? data2?.rows?.map(row => {
      return {
        "protocolSlug": row[1],
        "protocolName": row[1],
        "icon": row[0]
      }
    }) : data2;

  const loadProjectDetail = projectSlug => {
    loadCurrentFgaProjectNew(projectSlug);
  };

  const isFavoriteProject = (name) => {
    return games?.includes(name)
  }

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (_, record) => (
        record.icon ? <img src={record.icon} style={{height: 20, width: 20}}/> : <div style={{height: 20, width: 20, background: "#888"}}/>
      ),
    },
    {
      title: 'Protocol Name',
      dataIndex: 'protocolName',
      key: 'protocolName',
      render: (_, record) => (
        <a className="text-underline text-underline-hover" onClick={async () => {
          await loadProjectDetail(record.protocolName);
          router.replace(`/fga/${businessType}/project/${record.protocolName}/nft_summary`)
        }}>
          {record.protocolName}
        </a>
      ),
    },
    // {
    //   title: 'chain',
    //   dataIndex: 'chain',
    //   key: 'chain',
    // },
    // {
    //   title: 'Active Users',
    //   dataIndex: 'Active Users',
    //   key: 'Active Users',
    // },
    // {
    //   title: 'Transactions',
    //   dataIndex: 'Transactions',
    //   key: 'Transactions',
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link ></Link>
          <a onClick={() => {
            console.log("manage-games", games)
            const hide = message.loading("Loading...", 20000);
            setTimeout(async () => {
              hide();
              message.success(`Project ${record.protocolSlug} added to favorite project`);
              if (games.includes(record.protocolName)) {
                setGames(games.filter(game => game !== record.protocolName))
              } else {
                setGames([...games, record.protocolName])
              }

            }, 2000)
          }}>
            <StarFilled style={{ fontSize: '16px', color: isFavoriteProject(record.protocolName) ? '#ff0000' : '#888888' }}/>
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
            <h2>Projects</h2>
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
              placeholder="search name"
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
  loadCurrentFgaProjectNew,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    games: getGamesByRedux(state),
    businessType: props.params.businessType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(projectList);
