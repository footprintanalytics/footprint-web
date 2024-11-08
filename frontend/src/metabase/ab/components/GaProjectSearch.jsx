/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Select, Tour } from "antd";
import { withRouter } from "react-router";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectById, loadCurrentFgaProjectNew } from "metabase/redux/user";
import "../css/index.css";
import { head, throttle } from "lodash";
import { getGrowthProjectPath, getLatestGAProject, saveLatestGAProject, saveLatestGAProjectId } from "../utils/utils";
import _ from "underscore";
import { getFgaChain, getFgaProjectList, getGamesByRedux, getHistoryGamesByRedux } from "metabase/selectors/control";
import { loadFgaProjectList, loginModalShowAction, setGames, setHistoryGames } from "metabase/redux/control";
import { fga_menu_data_v2 } from "metabase/ab/utils/data";

const GaProjectSearch = props => {
  const {
    router,
    location,
    user,
    menu,
    projectPath,
    loadCurrentFgaProjectNew,
    loadCurrentFgaProjectById,
    businessType,
    fgaProjectList,
    loadFgaProjectList,
    enableTour = false,
    projectObject,
    width = 360,
    style,
    fromLeftMenu = false,
  } = props;
  const selectRef = useRef();
  const [userProject, setUserProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const ref1 = useRef(null);
  const [tourOpen, setTourOpen] = useState(false);
  const from = location?.pathname?.startsWith("/fga/pro") ? "pro" : "";
  const isProFga = location?.pathname?.startsWith("/fga/pro");
  const steps = [
    {
      title: 'Switch Project',
      description: 'You can switch to other projects here to analyze the metrics.',
      target: () => ref1?.current,
      nextButtonProps: {children: <div>ok</div>},
    }
  ]
  const defaultProject =
    {
      protocolSlug: "Gaming Demo Project 2",
      protocolName: "Gaming Demo Project 2",
    }

  const loadProjectDetail = projectId => {
    console.log("loadProjectDetail9", projectId)
    if (isProFga) {
      loadCurrentFgaProjectById(projectId, from);
    } else {
      const protocolSlug = fgaProjectList?.find(item => item.projectId === projectId)?.protocolSlug;
      loadCurrentFgaProjectNew(protocolSlug, from);
    }
  };

/*  useEffect(() => {
    if (projectPath) {
      loadProjectDetail(projectPath);
    }
  }, [projectPath])*/

  useEffect(() => {
    if (projectPath && projectPath !== "undefined") {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    } else {
      const temp_project =
        getLatestGAProject() ??
        (userProject?.length > 0 ? userProject[0].projectName : null);
      if (temp_project) {
        saveLatestGAProject(temp_project);
        setCurrentProject(temp_project);
        // if (
        //   location.pathname.startsWith("/project/") ||
        //   location.pathname === "/ab"
        // ) {
        //   router?.push({
        //     pathname: getGrowthProjectPath(temp_project),
        //   });
        // }
      }
    }
  }, [projectPath]);
  useEffect(() => {
    console.log("useEffectuseEffect", fgaProjectList)
    if (fgaProjectList?.length > 0 && !fromLeftMenu) {
      const projects = fgaProjectList;
      const index = projects.findIndex(i => i.projectName === currentProject);
      const projectIndex = index === -1 ? projects.length - 1 : index;
      let project = projects[projectIndex];
      if (project.projectId !== 1) {
        setCurrentProject(project.projectName);
        saveLatestGAProject(project.projectName);
        console.log("useEffect,loadProjectDetail", project.projectId, fromLeftMenu)
        loadProjectDetail(project.projectId);

        setUserProject(projects);
        if (
          index === -1 && location.pathname.startsWith("/fga/") && location.pathname.includes("/project")
        ) {
          router?.push({
            pathname: getGrowthProjectPath(project.projectName, menu),
            query: router?.location?.query,
          });
        }
      }
    }
  }, [fgaProjectList]);

  useEffect(() => {
    if (isProFga) {
      if (user?.id) {
        loadFgaProjectList({ from });
      }
    } else {
      loadFgaProjectList({ from });
    }
  }, [user?.id])

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    }
  }, [projectPath]);
  const handleProjectChange = async (value, uiOption) => {
    const option = userProject.find(item => item.protocolSlug === value) ||
      {
        projectName: uiOption.label,
        projectId: uiOption.value,
      }
    // saveLatestGAProject(option.protocolSlug);
    // setCurrentProject(option.protocolSlug);
    saveLatestGAProjectId(option.projectId);
    // loadProjectDetail(option.projectId);
    const keys = fga_menu_data_v2(businessType, projectObject, null, user).keys
    const currentPath = props.menu
    const path = keys.includes(currentPath) ? currentPath : keys[0]
    // if (option.projectName) {
    //   router?.push({
    //     pathname: getGrowthProjectPath(option.projectName, path),
    //   });
    // }
  };

  const list = isProFga ? (
    fgaProjectList
      ?.filter(item => item.projectId !== 1)
      ?.slice(-1)
  ) : fgaProjectList;
  return (
    <div className="flex flex-column items-center ga-project-search" ref={ref1} style={style}>
        <>
          {/*{userProject?.length > 0 && (*/}
            <Select
              style={{ width: width, "display": !isProFga || (isProFga && fgaProjectList?.length > 1) ? "" : "none"}}
              showSearch
              ref={selectRef}
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
                </div>
              )}
              loading={!fgaProjectList}
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
              // options={selectOptions}
            >
              {list
                ?.map(item => {
                const logo = item.logo;
                return (
                  <Select.Option key={item.projectId} label={item.projectName} value={item.projectId}>
                    <div className="flex align-center">
                       {logo && logo !== 'N/A' ? (
                         <Avatar
                           src={logo}
                           style={{height: 16, width: 16, borderRadius: "50%", background: "#ffffff"}}
                         />
                       ) : (
                         <Avatar
                           style={{height: 16, width: 16, borderRadius: "50%", background: "#6c70FF"}}
                         >
                           <div style={{fontSize: 12, lineHeight: "16px"}}>{head(item.projectName)}</div>
                         </Avatar>
                       )}
                       <span className="ml1" style={
                         {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: 260,
                        }
                      }>{item.projectName}</span>
                    </div>
                  </Select.Option>
                )
              })}
            </Select>
          {/*)}*/}
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
      {enableTour && window.localStorage.getItem("tour_project_search") !== "true" &&
        <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={steps} />
      }
    </div>
  );
};

const mapDispatchToProps = {
  loadCurrentFgaProjectNew,
  loadCurrentFgaProjectById,
  setGames: setGames,
  setHistoryGames: setHistoryGames,
  setLoginModalShowAction: loginModalShowAction,
  loadFgaProjectList: loadFgaProjectList,
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
    fgaProjectList: getFgaProjectList(state),
  };
};

export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GaProjectSearch);
