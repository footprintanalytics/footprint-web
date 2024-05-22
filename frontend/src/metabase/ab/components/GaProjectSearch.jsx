/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Select, Tour } from "antd";
import { withRouter } from "react-router";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import "../css/index.css";
import { head } from "lodash";
import { getGrowthProjectPath, saveLatestGAProject } from "../utils/utils";
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
    businessType,
    fgaProjectList,
    loadFgaProjectList,
    enableTour = false,
    projectObject,
  } = props;
  const selectRef = useRef();
  const [userProject, setUserProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const ref1 = useRef(null);
  const [tourOpen, setTourOpen] = useState(false);
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
      protocolSlug: "Gaming Demo Project",
      protocolName: "Gaming Demo Project",
    }

  const loadProjectDetail = protocolSlug => {
    loadCurrentFgaProjectNew(protocolSlug);
  };

  useEffect(() => {
    if (projectPath) {
      loadProjectDetail(projectPath);
    }
  }, [projectPath])

  useEffect(() => {
    if (fgaProjectList?.length > 0) {
      const projects = fgaProjectList;
      const index = projects.findIndex(i => i.protocolSlug === currentProject);
      const projectIndex = index === -1 ? 0 : index;
      let project = defaultProject;
      if (index >= 0) {
        project = projects[projectIndex];
      }
      setCurrentProject(project.protocolSlug);
      saveLatestGAProject(project.protocolSlug);

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
  }, [fgaProjectList]);

  useEffect(() => {
    loadFgaProjectList();
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
        protocolName: uiOption.label,
        protocolSlug: uiOption.value,
      }
    // saveLatestGAProject(option.protocolSlug);
    // setCurrentProject(option.protocolSlug);
    // saveLatestGAProjectId(option.value);
    // loadProjectDetail(option.protocolSlug);
    const keys = fga_menu_data_v2(businessType, projectObject, null).keys
    const currentPath = props.menu
    const path = keys.includes(currentPath) ? currentPath : keys[0]
    if (option.protocolSlug) {
      router?.push({
        pathname: getGrowthProjectPath(option.protocolSlug, path),
      });
    }
  };


  return (
    <div className="flex flex-column items-center ga-project-search" ref={ref1} >
        <>
          {/*{userProject?.length > 0 && (*/}
            <Select
              showSearch
              ref={selectRef}
              style={{ width: 360 }}
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
              {fgaProjectList?.map(item => {
                const logo = item.logo;
                return (
                  <Select.Option key={item.protocolSlug} label={item.projectName} value={item.protocolSlug}>
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
