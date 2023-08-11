/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Select, Modal, Skeleton } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import { loadCurrentFgaProject } from "metabase/redux/user";
import "../css/index.css";
import {
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
  getGrowthProjectPath,
  checkIsNeedContactUs,
} from "../utils/utils";
import Icon from "metabase/components/Icon";

const GaProjectSearch = props => {
  const {
    router,
    location,
    user,
    menu,
    projectPath,
    setCreateFgaProjectModalShowAction,
    logout,
  } = props;
  const [userProject, setUserProject] = useState([]);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const { isLoading, data } = useQuery(
    ["GetFgaProject", user?.id],
    async () => {
      const toggle_platform_project = localStorage.getItem('toggle_platform_project')
      if (toggle_platform_project === "project") {
        return {
          "data": [
          {
            "id": 153,
            "name": "Project A",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_153_data",
            "active": 1,
            "protocolSlug": "project a",
            "protocolName": "Project A",
            "nftContractAddress": [],
            "createdAt": "2023-04-25T10:51:11.000Z"
          }
          ]
        }
      }
      return {
        "data": [
          {
            "id": 153,
            "name": "Project A",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_153_data",
            "active": 1,
            "protocolSlug": "project a",
            "protocolName": "Project A",
            "nftContractAddress": [],
            "createdAt": "2023-04-25T10:51:11.000Z"
          },
          {
            "id": 341,
            "name": "Project B",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_341_data",
            "active": 1,
            "protocolSlug": "project b",
            "protocolName": "Project B",
            "nftContractAddress": [],
            "createdAt": "2023-07-17T09:09:36.000Z"
          },
          {
            "id": 35,
            "name": "Project C",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_35_data",
            "active": 1,
            "protocolSlug": "project c",
            "protocolName": "Project C",
            "nftContractAddress": [],
            "createdAt": "2023-07-17T09:09:36.000Z"
          },
          {
            "id": 36,
            "name": "Project D",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_36_data",
            "active": 1,
            "protocolSlug": "project d",
            "protocolName": "Project D",
            "nftContractAddress": [],
            "createdAt": "2023-07-17T09:09:36.000Z"
          },
          {
            "id": 10,
            "name": "Project E",
            "creatorId": 20103,
            "dbId": 22,
            "schema": "fga_36_data",
            "active": 1,
            "protocolSlug": "project e",
            "protocolName": "Project E",
            "nftContractAddress": [],
            "createdAt": "2023-07-17T09:09:36.000Z"
          }
        ]
      }
      // return await GetFgaProject();
    },
    QUERY_OPTIONS,
  );

  const loadProjectDetail = project_id => {
    props.dispatch(loadCurrentFgaProject(parseInt(project_id)));
  };

  useEffect(() => {
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
                {/*<Icon className="mr1" name="circle" size={16}/>*/}
                {p.protocolName ?? p.name}
              </div>,
            key: p.protocolSlug + p.id,
          });
        });
        const index = projects.findIndex(i => i.value === currentProject);
        const projectIndex = index === -1 ? 0 : index;
        setCurrentProject(projects[projectIndex].value);
        saveLatestGAProject(projects[projectIndex].value);
        saveLatestGAProjectId(projects[projectIndex].id);
        loadProjectDetail(projects[projectIndex].id);
        setUserProject(projects);
        if (
          index === -1 ||
          location.pathname === "/fga" ||
          location.pathname.startsWith("/fga/project")
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
  }, [data, isLoading]);

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
  const handleProjectChange = (value, option) => {
    saveLatestGAProject(option.value);
    setCurrentProject(option.value);
    if (option.id) {
      saveLatestGAProjectId(option.id);
      loadProjectDetail(option.id);
    }
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
            <Select
              // showSearch
              style={{ width: 218, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff20"
              }}
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
              options={userProject?.length > 0 ? userProject : []}
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

      {contextHolder}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSearch));
