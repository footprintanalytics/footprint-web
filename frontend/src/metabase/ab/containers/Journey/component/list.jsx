/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Icon from "metabase/components/Icon";
import { Table, Tag, Space } from "antd";
import Buttons from "metabase/ab/containers/Journey/component/Buttons";
import Link from "antd/es/typography/Link";
import Head from "metabase/ab/containers/Journey/component/Head";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";

const List = props => {
  const { router, Modal, projectObject } = props;
  const [modal, contextHolder] = Modal.useModal();
  const projectName = projectObject.protocolSlug;
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Last updated by',
      dataIndex: 'lastUpdatedBy',
      key: 'lastUpdatedBy',
    },
    {
      title: 'Update Time',
      key: 'updateTime',
      dataIndex: 'updateTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">s
          <Link to={`/ab/project/${projectName}/journey-edit`}><Icon name="edit_document" size={12} color="white"/></Link>
          <a onClick={() => {
            modal.info({ title: "Delete"})
          }}><Icon name="trash" size={12} color="white"/></a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
    {
      key: '2',
      name: 'Jim Green',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
    {
      key: '3',
      name: 'Joe Black',
      description: "Add multiple metrics within the same report",
      lastUpdatedBy: "Admin",
      updateTime: 121212121,
    },
  ];
  return (
    <div className="journey-list">
      <Head title="Saved Journey" isBack buttons={["create"]} router={router}/>
      <div className="journey-list__table">
        <Table className="full-width" columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(List);
