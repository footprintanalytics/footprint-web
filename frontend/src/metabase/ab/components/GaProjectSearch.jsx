/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, message, Modal, Select } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject, getProtocolList, getPublicChainProjects } from "metabase/new-service";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import Link from "metabase/core/components/Link";
import "../css/index.css";
import { take } from "lodash";
import {
  checkIsNeedContactUs,
  getGrowthProjectPath,
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../utils/utils";
import _ from "underscore";
import { getFgaChain, getFgaFavoriteList, getGamesByRedux, getHistoryGamesByRedux } from "metabase/selectors/control";
import { loadFgaFavoriteList, loginModalShowAction, setGames, setHistoryGames } from "metabase/redux/control";
import CreateMyProjectModal from "metabase/ab/components/Modal/CreateMyProjectModal";
import { getOssUrl } from "metabase/lib/image";

const GaProjectSearch = props => {
  const {
    router,
    location,
    user,
    menu,
    projectPath,
    setCreateFgaProjectModalShowAction,
    logout,
    control,
    setGames,
    setHistoryGames,
    games,
    historyGames,
    projectObject,
    setLoginModalShowAction,
    loadCurrentFgaProjectNew,
    businessType,
    chain,
    favoriteList,
    loadFgaFavoriteList,
  } = props;
  const [userProject, setUserProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(projectPath);
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
        return await getProtocolList({ chain });
      }
      return {
        "data": [
          {
            "protocolSlug": "Project A",
            "protocolName": "Project A",
          },
          {
            "protocolSlug": "Mocaverse",
            "protocolName": "Mocaverse",
          },
          {
            "protocolSlug": "xxx",
            "protocolName": "xxx",
          },
          {
            "protocolSlug": "duke",
            "protocolName": "duke",
          },
          {
            "protocolSlug": "TorqueSquad",
            "protocolName": "TorqueSquad",
          },
        ]
      }
      // return await getPublicChainProjects();
    },
    QUERY_OPTIONS,
  );

  const loadProjectDetail = protocolSlug => {
    loadCurrentFgaProjectNew(protocolSlug);
  };

  useEffect(() => {
    loadFgaFavoriteList();
  }, [])

  useEffect(() => {
    // const data = (businessType === "public-chain") ? {data: data2?.rows?.map(row => {
    //   return {
    //     "protocolSlug": row[1],
    //     "protocolName": row[1],
    //   }
    // })} : data2;
    const data = data2;
    if (data) {
      data.data = data.protocolList;
    }
    if (!isLoading && data?.data) {
      if (data?.data?.length > 0) {
        const projects = [];
        data?.data?.map(p => {
          projects.push({
            ...p,
            value:
              !p.protocolSlug || p.protocolSlug === ""
                ? "default"
                : p.protocolSlug,
            label:
              <div className="flex align-center">
                <img className="mr1" style={{width: 16, height: 16}} src={p.icon ? p.icon : getOssUrl(`/ab/Project A.png?image_process=resize,w_16/crop,h_16/format,jpg`)} alt={p.protocolName}/>
                {p.protocolName}
              </div>,
            key: p.protocolSlug,
          });
        });
        console.log("projects", projects)
        const index = projects.findIndex(i => i.value === currentProject);
        const projectIndex = index === -1 ? 0 : index;
        setCurrentProject(projects[projectIndex].value);
        // saveLatestGAProject(projects[projectIndex].value);
        // // saveLatestGAProjectId(projects[projectIndex].id);
        loadProjectDetail(projects[projectIndex].protocolSlug);
        setUserProject(projects);
        if (
          index === -1 ||
          location.pathname === "/fga" ||
          (location.pathname.startsWith("/fga") && location.pathname.includes("project/"))
        ) {
          router?.push({
            pathname: getGrowthProjectPath(projects[projectIndex].value, menu),
            query: router?.location?.query,
          });
        }
      } else {
        setUserProject([]);
        if (user) {
          checkIsNeedContactUs(
            modal,
            null,
            () => {
              setCreateFgaProjectModalShowAction({ show: true });
            },
            () => {},
            false,
          );
          // setCreateFgaProjectModalShowAction?.({
          //   show: true,
          //   force: true,
          // });
        }
      }
    }
    // getAllProtocol();
  }, [data2, isLoading]);

  useEffect(() => {
    if (projectObject) {
      const protocolSlug = projectObject.protocolSlug;
      if (!historyGames.includes(protocolSlug)) {
        setHistoryGames(take([protocolSlug, ...(historyGames || [])], 2))
      }
    }
  }, [projectObject])

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    } else {
      const temp_project =
        getLatestGAProject() ??
        (userProject?.length > 0 ? userProject[0].value : null);
      if (temp_project) {
        saveLatestGAProject(temp_project);
        setCurrentProject(temp_project);
        if (
          location.pathname.startsWith("/fga/project") ||
          location.pathname === "/fga"
        ) {
          router?.push({
            pathname: getGrowthProjectPath(temp_project),
          });
        }
      }
    }
  }, [projectPath]);
  const handleProjectChange = async (value, option2) => {
    const option = userProject.find(item => item.protocolSlug === value) || option2
    console.log("handleProjectChange", option, getGrowthProjectPath(option.value))
    saveLatestGAProject(option.value);
    setCurrentProject(option.value);
    saveLatestGAProjectId(option.protocolSlug);
    loadProjectDetail(option.protocolSlug);
    if (
      (location.pathname.startsWith("/fga/project") ||
        location.pathname === "/fga") &&
      option.value
    ) {
      // window.location.href = getGrowthProjectPath(option.value);
      router?.push({
        pathname: getGrowthProjectPath(option.value),
      });
    }
  };

  return (
    <div className="flex flex-column items-center ga-project-search" style={{ minWidth: 218 }}>
      {!isLoading && (
        <>
          {userProject?.length > 0 && (
            // <Select
            //   // showSearch
            //   style={{ width: 218, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
            //   dropdownStyle={{
            //     background: "#1C1C1E",
            //     color: "white",
            //     border: "1px solid #ffffff20"
            //   }}
            //   value={currentProject}
            //   loading={isLoading}
            //   defaultOpen={true}
            //   onChange={handleProjectChange}
            //   optionLabelProp="optionHighlight"
            //   placeholder="Search by protocol or nft collection address"
            //   // optionFilterProp="children"
            //   // filterOption={(input, option) =>
            //   //   (option?.label ?? "")
            //   //     .toLowerCase()
            //   //     .includes(input.toLowerCase()) ||
            //   //   (option?.collections_list ?? [])
            //   //     .join(",")
            //   //     .includes(input.toLowerCase())
            //   // }
            //   dropdownRender={(menu) => (
            //     <div>
            //       {menu}
            //       <Divider className="my2" />
            //       <div>My Game</div>
            //       <div className="flex flex-column">
            //         {cgames.map(item => {
            //           return `${item}`
            //         })}
            //       </div>
            //       <Divider className="my2" />
            //       <Button type="text" onClick={() => {}} >Create your project</Button>
            //       <Link to={"/fga/games-manage"}><Button type="text"  >See other project</Button></Link>
            //     </div>
            //   )}
            // >
            //   {(userProject?.length > 0 ? userProject : []).map((option, index) => {
            //     console.log("option", option)
            //     return (
            //       <Option key={index} value={option.protocolSlug} optionHighlight={<div>{option.protocolSlug}{`${isClaimGame(option.protocolSlug) ? "(R)": ""}`}</div>}>
            //       <div className="flex justify-between full-width align-center" >
            //         <div>
            //           {option.protocolSlug}
            //           {isClaimGame(option.protocolSlug) && (<span>(R)</span>)}
            //         </div>
            //         {!isClaimGame(option.protocolSlug) && (<Button type="text" onClick={() => {claimGame(option.protocolSlug)}} >Claim</Button>)}
            //       </div>
            //     </Option>
            //   )})}
            // </Select>
            <Select
              // showSearch
              style={{ width: 218 }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff30"
              }}
              dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ margin: "10px 0", borderTop: "1px solid #ffffff20" }}/>
                      {/*<Button className="full-width" type="primary" onClick={() => {
                        if (!user) {
                          message.warning("Kindly login before to create a project.");
                          setLoginModalShowAction({
                            show: true,
                            from: "create activation",
                            redirect: location.pathname,
                            channel: "FGA",
                          });
                          return;
                        }
                        setOpen(true);
                      }} >Create your project</Button>*/}
                      <Link onClick={() => {
                        if (!user) {
                          message.warning("Kindly login before see other project.");
                          setLoginModalShowAction({
                            show: true,
                            from: "create activation",
                            redirect: location.pathname,
                            channel: "FGA",
                          });
                          return;
                        }
                        router.push(`/fga/${businessType}/games-manage`)
                      }}><Button className="full-width" type="text"  >See other project</Button></Link>
                    </div>
                  )}
              value={currentProject}
              loading={isLoading}
              onChange={handleProjectChange}
              placeholder="Search by protocol or nft collection address"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase()) ||
                (option?.collections_list ?? [])
                  .join(",")
                  .includes(input.toLowerCase())
              }
              options={
                [
                  historyGames.length > 0 && {
                    label: 'Recent',
                    options: historyGames.map(item=> {return {label: item, value: item}}),
                  },
                  favoriteList.length > 0 && {
                    label: 'My Projects',
                    options: favoriteList.map(item=> {return {label: item.protocolName, value: item.protocolSlug}}),
                    // options: games.map(item=> {return {label: item, value: item}}),
                  },
                  // {
                  //   label: 'Sample Project',
                  //   options: [{ label: 'Project A', value: 'Project A' }],
                  // },
                ].filter(Boolean)}
            />
          )}
        </>
      )
      //  : (
      //   <Skeleton.Button
      //     active={true}
      //     className="flex flex-column items-center"
      //     style={{ width: 300, height: 30, marginTop: 15, padding: 0 }}
      //     paragraph={false}
      //   />
      // )
      }
      <CreateMyProjectModal
        open={open}
        setOpen={setOpen}
        onSuccess={gameInfo => {
          const hide = message.loading("create a new game...", 20000);
          setTimeout(async () => {
            hide();
            const name = gameInfo.name;
            const games2 = games || []
            console.log("CreateMyProjectModal before", games)
            if (!games2.includes(name)) {
              setGames([...games2, name])
              const option = userProject.find(item => item.protocolSlug === name)
              await loadProjectDetail(option?.protocolSlug);
              console.log("CreateMyProjectModal after", [...games, name], option)
              router.replace(`/fga/project/${name}/project_health`)
            }
          }, 2000)

        }}
      />
      {contextHolder}
    </div>
  );
};

const mapDispatchToProps = {
  loadCurrentFgaProjectNew,
  setGames: setGames,
  setHistoryGames: setHistoryGames,
  setLoginModalShowAction: loginModalShowAction,
  loadFgaFavoriteList,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    projectPath: props.params.project,
    menu: props.params.menu,
    control: state.control,
    games: getGamesByRedux(state),
    historyGames: getHistoryGamesByRedux(state),
    businessType: props.params.businessType,
    chain: getFgaChain(state),
    favoriteList: getFgaFavoriteList(state),
  };
};

export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GaProjectSearch);
