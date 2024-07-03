/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { connect } from "react-redux";
import { Avatar, Input, message, Space, Spin, Table } from "antd";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import { loadFgaFavoriteList, loadFgaProjectList, setGames } from "metabase/redux/control";
import {
  getFgaChain,
  getFgaFavoriteList,
  getFgaProjectList,
  getFgaProtocolList,
  getGamesByRedux,
} from "metabase/selectors/control";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { deleteProject, getProjectList } from "metabase/new-service";
import Link from "metabase/core/components/Link";
import { getGrowthProjectPath } from "metabase/ab/utils/utils";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/about/config";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { head } from "lodash";

const { Search } = Input;

const projectList = props => {
  const { router, location, children, user, projectPath, menu, projectObject, fgaProjectList, loadFgaProjectList } =
    props;
  const [searchKey, setSearchKey] = useState();

  const filterData = fgaProjectList?.filter(d => !searchKey || d?.protocolSlug?.toLowerCase()?.includes(searchKey))

  const deleteAction = async (record) => {
    const hide = message.loading("Loading...", 20000);
    await deleteProject({
      projectId: record.projectId,
    })
    await loadFgaProjectList();
    hide();
    message.success("Delete project successfully");
    console.log("deleteAction", record, projectObject)
    if (record.protocolSlug === projectObject.protocolSlug) {
      router.replace(getGrowthProjectPath("Gaming Demo Project"))
    }
  }

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 60,
      render: (_, record) => (
        record.logo && record.logo !== 'N/A' ? (
          <Avatar
            src={record.logo}
            style={{height: 32, width: 32, borderRadius: "50%", background: "#ffffff"}}
          />
        ): (
          <Avatar
            style={{height: 32, width: 32, borderRadius: "50%", background: "#6c70FF"}}
          >
            <div style={{fontSize: 14, lineHeight: "32px"}}>{head(record.projectName)}</div>
          </Avatar>
        )
      ),
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (_, record) => (
        <Link to={getGrowthProjectPath(record.protocolSlug, "project_summary")}>
          {record.projectName}
        </Link>
      ),
    },
    // {
    //   title: 'Protocol Name',
    //   dataIndex: 'protocolName',
    //   key: 'protocolName',
    // },
    // {
    //   title: 'Protocol Slug',
    //   dataIndex: 'protocolSlug',
    //   key: 'protocolSlug',
    // },
    {
      title: 'Project Category',
      dataIndex: 'protocolType',
      key: 'protocolType',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Link onClick={() => {
            if (record.protocolSlug !== "Demo Project") {
              deleteAction(record)
            } else {
              message.info("Demo Project can not be deleted")
            }
          }}>
            <DeleteOutlined style={{ fontSize: '16px'}}/>
          </Link>
          <Link to={getGrowthProjectPath(record.protocolSlug, "general")}>
            <SettingOutlined style={{ fontSize: '16px'}}/>
          </Link>
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
            <h2>All Projects</h2>
            <span className="text-white">
               <Link to={getGrowthProjectPath(projectObject.protocolSlug, "my-submit-project")}>My submitted project records</Link>
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
          <div className="flex justify-end mb1" >
            <Search
              placeholder="search project"
              allowClear
              enterButton="Search"
              onChange={e => setSearchKey(e.target.value)}
              style={{ width: 300, margin: "4px 0" }}
            />
          </div>
          {/*<Spin spinning={isLoading} indicator={<LoadingSpinner />} size={"large"} className={"project-list-table-loading"} >*/}
            <Table dataSource={filterData} columns={columns} />
          {/*</Spin>*/}
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  setGames: setGames,
  loadCurrentFgaProjectNew,
  loadFgaFavoriteList,
  loadFgaProjectList: loadFgaProjectList,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    chain: getFgaChain(state),
    games: getGamesByRedux(state),
    businessType: props?.params?.businessType || props?.businessType,
    favoriteList: getFgaFavoriteList(state),
    protocolList: getFgaProtocolList(state),
    fgaProjectList: getFgaProjectList(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(projectList);
