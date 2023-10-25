/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, message, Space, Table } from "antd";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import { loadFgaFavoriteList, setGames } from "metabase/redux/control";
import { getFgaChain, getFgaFavoriteList, getFgaProtocolList, getGamesByRedux } from "metabase/selectors/control";
import { StarFilled } from "@ant-design/icons";
import { deleteProtocolFavorite, postProtocolFavorite } from "metabase/new-service";
import { uniqBy } from "lodash";
import Link from "metabase/core/components/Link";
import { isBusinessTypePath } from "metabase/ab/utils/utils";
import { getGrowthProjectPath } from "metabase/ab/utils/utils";
import getHeadDataProtocols from "metabase/ab/containers/gameList/data";

const { Search } = Input;

const projectList = props => {
  const { router, location, children, user, projectPath, menu, projectObject, games, setGames, loadCurrentFgaProjectNew, businessType, chain, loadFgaFavoriteList, favoriteList, protocolList } =
    props;
  const userId = 158;
  const projectId = 153;

  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });
  const [searchKey, setSearchKey] = useState();

  const params = {
    ecosystemId: 415,
  };

/*  const { isLoading: isFavoriteLoading, data: favoriteData, refetch: favoriteRefetch } = useQuery(["getProtocolFavorite"],
    () => {
      return getProtocolFavorite();
    },
    QUERY_OPTIONS,
  );*/

  // const { isLoading, data: data2 } = useQuery(
  //   ["GetFgaProject", user?.id],
  //   async () => {
  //     // const toggle_platform_project = localStorage.getItem('toggle_platform_project')
  //     // if (toggle_platform_project === "project") {
  //     //   return {
  //     //     "data": [
  //     //     {
  //     //       "protocolSlug": "Project A",
  //     //       "protocolName": "Project A",
  //     //     }
  //     //     ]
  //     //   }
  //     // }
  //     if (businessType === "public-chain") {
  //       return await getProtocolList({chain});
  //     }
  //     return {
  //       "data": [
  //         {
  //           "id": 154,
  //           "protocolSlug": "mocaverse",
  //           "protocolName": "Mocaverse",
  //           "chain": "BNB Chain, Polygon",
  //           "Active Users": 3234,
  //           "Transactions": 223456,
  //           "icon": "https://i.seadn.io/gcs/files/649cd263c9518915328df38b2db1a6f3.png?auto=format&w=256"
  //         },
  //         {
  //           "id": 157,
  //           "protocolSlug": "TorqueSquad",
  //           "protocolName": "TorqueSquad",
  //           "chain": "BNB Chain, Polygon",
  //           "Active Users": 1000,
  //           "Transactions": 88355,
  //           "icon": "https://footprint-imgs.oss-us-east-1.aliyuncs.com/logo_images/torque-squad.png"
  //         },
  //       ]
  //     }
  //     // return await getPublicChainProjects();
  //   },
  //   QUERY_OPTIONS,
  // );

  // const data = (businessType === "public-chain") ? data2?.rows?.map(row => {
  //     return {
  //       "protocolSlug": row[1],
  //       "protocolName": row[1],
  //       "icon": row[0]
  //     }
  //   }) : data2;

  let data;
  if (protocolList) {
    data = protocolList?.sort((a, b) => a.protocolSlug < b.protocolSlug ? -1 : 1)
    data = [...uniqBy(data, obj => obj.protocolSlug)]
    if (isBusinessTypePath("game-project")) {
      const headData = getHeadDataProtocols().map(item => data.find(i => i.protocolSlug === item));
      const endData = data.filter(item => !getHeadDataProtocols().includes(item.protocolSlug));
      data = [...headData, ...endData]
    }
    data = data?.filter(item => {
      return searchKey ? item.protocolSlug?.includes(searchKey) || item.protocolName?.includes(searchKey) : true;
    });
  }

  const loadProjectDetail = projectSlug => {
    loadCurrentFgaProjectNew(projectSlug);
  };

  const isFavoriteProject = (name) => {
    return favoriteList?.map(f => f.protocolName)?.includes(name)
    // return games?.includes(name)
  }

  const favoriteAction = async (record) => {
    const hide = message.loading("Loading...", 20000);
    let api;
    let successText;
    const favorite = isFavoriteProject(record.protocolName);

    if (favorite) {
      api = deleteProtocolFavorite;
      successText = `Project ${record.protocolName} removed to my project`;
    } else {
      api = postProtocolFavorite;
      successText = `Project ${record.protocolName} added to my project`;
    }
    await api({
      protocolSlug: record.protocolSlug,
      protocolName: record.protocolName,
    })
    await loadFgaFavoriteList();
    hide();
    message.success(successText);
  }

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 60,
      render: (_, record) => (
        record.logo && record.logo !== 'N/A' ? <img src={record.logo} style={{height: 32, width: 32}}/> : <div style={{height: 32, width: 32, background: "#222"}}/>
      ),
    },
    {
      title: 'Protocol Name',
      dataIndex: 'protocolName',
      key: 'protocolName',
      render: (_, record) => (
        <a className="text-underline text-underline-hover" onClick={async () => {
          await loadProjectDetail(record.protocolSlug);
          router.replace(`/fga/${businessType}/project/${record.protocolSlug}/project_summary`)
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
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            console.log("manage-games", games)
            favoriteAction(record);
            // setTimeout(async () => {
            //   hide();
            //   message.success(`Project ${record.protocolSlug} added to favorite project`);
            //   if (games.includes(record.protocolName)) {
            //     setGames(games.filter(game => game !== record.protocolName))
            //   } else {
            //     setGames([...games, record.protocolName])
            //   }
            //
            // }, 2000)
          }}>
            <StarFilled style={{ fontSize: '16px', color: isFavoriteProject(record.protocolName) ? '#fa8c16' : '#8c8c8c' }}/>
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
          <div className="flex justify-between items-center">
            <h2>Projects
              {isBusinessTypePath("public-chain") && <>({`${chain}`})</>}
            </h2>
            <span className="text-white">Select {" "}
              <Link to={getGrowthProjectPath("Project A", "project_summary")}>Project A</Link>
              {" "} to see full Sample.
            </span>
          </div>
          {/*<div className="flex justify-end full-width mb1">
            <Button onClick={() => {
              setSubmitModalOpen({ open: true, param: null });
              // postProjectApi();
            }}>
              Add Game
            </Button>
          </div>*/}
          <div className="flex justify-end mb1">
            <Search
              placeholder="search name"
              allowClear
              enterButton="Search"
              onChange={e => setSearchKey(e.target.value)}
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
  loadFgaFavoriteList,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    chain: getFgaChain(state),
    games: getGamesByRedux(state),
    businessType: props.params.businessType,
    favoriteList: getFgaFavoriteList(state),
    protocolList: getFgaProtocolList(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(projectList);
