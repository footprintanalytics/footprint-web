/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Button, message, Modal, Select } from "antd";
import { withRouter } from "react-router";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import Link from "metabase/core/components/Link";
import "../css/index.css";
import { take } from "lodash";
import { getGrowthProjectPath, isBusinessTypePath, saveLatestGAProject } from "../utils/utils";
import _ from "underscore";
import {
  getFgaChain,
  getFgaFavoriteList,
  getFgaProtocolList,
  getGamesByRedux,
  getHistoryGamesByRedux,
} from "metabase/selectors/control";
import {
  loadFgaFavoriteList,
  loadFgaProtocolList,
  loginModalShowAction,
  setGames,
  setHistoryGames,
} from "metabase/redux/control";
import { getChainDataList } from "metabase/query_builder/components/question/handle";

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
    protocolList,
    loadFgaProtocolList,
    disableLoadList,
  } = props;
  const selectRef = useRef();
  const userId = user?.id;
  const [userProject, setUserProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const protocolListLen = protocolList?.length;

  let defaultProject;
  if (isBusinessTypePath("public-chain")) {
    defaultProject = getChainDataList({ includeAll: false })?.find(item => item.label === chain)?.defaultProject ||
      {
        protocolSlug: "the-sandbox",
        protocolName: "The Sandbox",
      }
  } else {
    defaultProject =
      {
        "protocolName": "The Sandbox",
        "protocolSlug": "the-sandbox",
      }
  }


  // console.log("currentProject", currentProject)
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
  //       return await getProtocolList({ chain });
  //     }
  //     return {
  //       "data": [
  //         {
  //           "protocolSlug": "Project A",
  //           "protocolName": "Project A",
  //         },
  //         {
  //           "protocolSlug": "Mocaverse",
  //           "protocolName": "Mocaverse",
  //         },
  //         {
  //           "protocolSlug": "xxx",
  //           "protocolName": "xxx",
  //         },
  //         {
  //           "protocolSlug": "duke",
  //           "protocolName": "duke",
  //         },
  //         {
  //           "protocolSlug": "TorqueSquad",
  //           "protocolName": "TorqueSquad",
  //         },
  //       ]
  //     }
  //     // return await getPublicChainProjects();
  //   },
  //   QUERY_OPTIONS,
  // );

  const loadProjectDetail = protocolSlug => {
    loadCurrentFgaProjectNew(protocolSlug);
  };

  useEffect(() => {
    if ((!favoriteList || !userId) && !disableLoadList) {
      loadFgaFavoriteList();
    }
  }, [userId, disableLoadList])

  useEffect(() => {
    if (projectPath) {
      loadProjectDetail(projectPath);
    }
  }, [projectPath])

  useEffect(() => {
    if (protocolListLen === 0 && !disableLoadList) {
      loadFgaProtocolList(chain);
    }
  }, [disableLoadList, chain, protocolListLen])


  useEffect(() => {
    if (protocolList?.length > 0) {
      const projects = protocolList;
      const index = projects.findIndex(i => i.protocolSlug === currentProject);
      const projectIndex = index === -1 ? 0 : index;
      let project = defaultProject;
      if (index >= 0) {
        project = projects[projectIndex];
      }
      setCurrentProject(project.protocolSlug);
      saveLatestGAProject(project.protocolSlug);
      // saveLatestGAProjectId(project.id);
      loadProjectDetail(project.protocolSlug);
      setUserProject(projects);
      if (
        index === -1 && location.pathname.startsWith("/fga/") && location.pathname.includes("/project")
      ) {
        router?.push({
          pathname: getGrowthProjectPath(project.protocolSlug, menu),
          query: router?.location?.query,
        });
      }
    }
  }, [protocolList]);

  useEffect(() => {
    if (projectObject) {
      const protocolSlug = projectObject.protocolSlug;
      const protocolName = projectObject.protocolName;
      const newObject = {
        protocolSlug,
        protocolName,
      }
      if (!historyGames.find(item => item.protocolSlug === protocolSlug)) {
        setHistoryGames(take([newObject, ...(historyGames || [])], 2))
      }
    }
  }, [projectObject])

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    }
    // else {
    //   const temp_project =
    //     getLatestGAProject() ??
    //     (userProject?.length > 0 ? userProject[0].value : null);
    //   if (temp_project) {
    //     saveLatestGAProject(temp_project);
    //     setCurrentProject(temp_project);
    //     if (
    //       location.pathname.startsWith("/fga/project") ||
    //       location.pathname === "/fga"
    //     ) {
    //       router?.push({
    //         pathname: getGrowthProjectPath(temp_project),
    //       });
    //     }
    //   }
    // }
  }, [projectPath]);
  const handleProjectChange = async (value, uiOption) => {
    const option = userProject.find(item => item.protocolSlug === value) ||
      {
        protocolName: uiOption.label,
        protocolSlug: uiOption.value,
      }
    // saveLatestGAProject(option.protocolSlug);
    // setCurrentProject(option.protocolSlug);
    // saveLatestGAProjectId(option.value);
    // loadProjectDetail(option.protocolSlug);
    if (option.protocolSlug) {
      router?.push({
        pathname: getGrowthProjectPath(option.protocolSlug),
      });
    }
  };

  const getProjectLogo = (item) => {
    if (protocolList?.length > 0) {
      return protocolList?.find(protocol => item.protocolSlug === protocol.protocolSlug)?.logo
    }
    return "";
  }

  const selectDataMapFunction = ( superKey) => {
    return (item) => {
      const logo = getProjectLogo(item);
      return {
        key: `${superKey}-${item.protocolSlug}`,
        label: (
          <div className="flex align-center">
            {logo && logo !== 'N/A' ? <img src={logo} style={{height: 16, width: 16}} alt={item.protocolSlug}/> : <div style={{height: 16, width: 16, background: "#222"}}/>}
            <span className="ml1" style={
              {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: 160,
              }
            }>{item.protocolName}</span>
          </div>
        ),
        value: item.protocolSlug
      }
    }
  }

  let selectOptions

  // if (isBusinessTypePath("public-chain")) {
    selectOptions = [
      historyGames?.length > 0 && {
        label: "Recent",
        key: "Recent",
        options: historyGames.map(selectDataMapFunction("Recent")),
      },
      favoriteList?.length > 0 && {
        label: "My Projects",
        options: favoriteList.map(selectDataMapFunction("My Projects")),
      },
    ].filter(Boolean)
  // } else {
  //   selectOptions = [
  //     {
  //       value: "the-sandbox",
  //       label: "The Sandbox",
  //     }
  //   ]
  // }

  return (
    <div className="flex flex-column items-center ga-project-search" style={{ minWidth: 218 }}>
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
              ref={selectRef}
              style={{ width: 218 }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff30"
              }}
              open={open}
              onDropdownVisibleChange={(open) => setOpen(open)}
              dropdownRender={(menu) => (
                    <div>
                      {menu}
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
                      {/*{isBusinessTypePath("public-chain") && (*/}
                        <>
                          <div style={{ margin: "6px 0", borderTop: "1px solid #ffffff20" }}/>
                          <Link
                            onClick={() => {
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
                            setOpen(false)
                            setTimeout(() => {
                              router.push(`/fga/${businessType}/project-manage`)
                            }, 300)
                          }}>
                            <Button className="full-width" type="text" >See other project</Button>
                          </Link>
                        </>
                      {/*)}*/}
                    </div>
                  )}
              value={currentProject}
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
              options={selectOptions}
            />
          )}
        </>
      {/*<CreateMyProjectModal
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
              router.replace(`/fga/public-chain/project/${name}/project_health`)
            }
          }, 2000)

        }}
      />*/}
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
  loadFgaProtocolList,
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
    protocolList: getFgaProtocolList(state),
  };
};

export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GaProjectSearch);
