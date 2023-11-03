/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Button, message, Modal, Select, Tour } from "antd";
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
import { fga_menu_data_v2 } from "metabase/ab/utils/data";
import { getProjectList } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/about/config";
import { useQuery } from "react-query";

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
    disableLoadList,
    enableTour = false,
  } = props;
  const selectRef = useRef();
  const userId = user?.id;
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
        protocolSlug: "Demo Project",
        protocolName: "Demo Project",
      }
  }

  useEffect(() => {
    if (businessType && location.pathname.split("/").length === 3 && projectObject) {
      const menuData = fga_menu_data_v2(businessType, projectObject, user);
      const menuKeys = menuData.keys;
      router.replace(getGrowthProjectPath(defaultProject.protocolSlug, menuKeys[0]))
    }
  }, [location.pathname])

  // useEffect(() => {
  //   if (enableTour && protocolList.length > 0 && userProject) {
  //     setTimeout(() => {
  //       setTourOpen(true)
  //       window.localStorage.setItem("tour_project_search", "true");
  //     }, 1000)
  //   }
  // }, [enableTour, protocolList, userProject])


  // console.log("currentProject", currentProject)
  const { isLoading, data, refetch } = useQuery(
    ["getProjectList", user?.id],
    async () => {
      return await getProjectList();
    },
    QUERY_OPTIONS,
  );
  console.log("getProjectList", data)
  const loadProjectDetail = protocolSlug => {
    loadCurrentFgaProjectNew(protocolSlug);
  };

  // useEffect(() => {
  //   if ((!favoriteList || !userId) && !disableLoadList) {
  //     loadFgaFavoriteList();
  //   }
  // }, [userId, disableLoadList])

  useEffect(() => {
    if (projectPath) {
      loadProjectDetail(projectPath);
    }
  }, [projectPath])

  // useEffect(() => {
  //   if (protocolListLen === 0 && !disableLoadList) {
  //     loadFgaProtocolList(chain);
  //   }
  // }, [disableLoadList, chain, protocolListLen])


  useEffect(() => {
    if (data?.length > 0) {
      const projects = data;
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
  }, [data]);

  useEffect(() => {
    if (projectObject) {
      const protocolSlug = projectObject.protocolSlug;
      const protocolName = projectObject.protocolName;
      const newObject = {
        protocolSlug,
        protocolName,
      }
      // if (!historyGames.find(item => item.protocolSlug === protocolSlug)) {
      //   setHistoryGames(take([newObject, ...(historyGames || [])], 2))
      // }
      refetch()
    }
  }, [projectObject])

  const [modal, contextHolder] = Modal.useModal();

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
    if (option.protocolSlug) {
      router?.push({
        pathname: getGrowthProjectPath(option.protocolSlug),
      });
    }
  };

  const selectDataMapFunction = ( superKey) => {
    return (item) => {
      const logo = item.logo;
      return {
        key: `${superKey}-${item.protocolSlug}`,
        label: (
          <div className="flex align-center">
            {logo && logo !== 'N/A' ? <img src={logo} style={{height: 16, width: 16}} alt={item.protocolSlug}/> : <div style={{height: 16, width: 16, borderRadius: "50%", background: "#6c70FF"}}/>}
            <span className="ml1" style={
              {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: 160,
              }
            }>{item.projectName}</span>
          </div>
        ),
        value: item.protocolSlug
      }
    }
  }

  const selectOptions = data?.map(selectDataMapFunction(""))

  return (
    <div className="flex flex-column items-center ga-project-search" ref={ref1} >
        <>
          {/*{userProject?.length > 0 && (*/}
            <Select
              // showSearch
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
      {contextHolder}
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
  };
};

export default _.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GaProjectSearch);
