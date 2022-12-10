/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import AboutExploreDomain from "metabase/containers/about/components/AboutExploreDomain";
import AboutCreateDashboard from "metabase/containers/about/components/AboutCreateDashboard";
import Meta from "metabase/components/Meta";
import {
  getActivityZkspaceRegisterSuccess,
  isRegisterActivityChannel,
  zkspaceDate,
} from "metabase/lib/register-activity";
import ActivityZkspaceFirstModal from "metabase/components/ActivityZkspaceFirstModal";
import * as Urls from "metabase/lib/urls";
import { getChannel } from "metabase/selectors/app";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import ActivityZkspaceSignupSuccessModal from "metabase/components/ActivityZkspaceSignupSuccessModal";
import HomeFooter from "../home/components/HomeFooter";
import AboutStart from "./components/AboutStart";
import AboutService from "./components/AboutService";
import AboutBuild from "./components/AboutBuild";
import AboutBacked from "./components/AboutBacked";
import AboutPartner from "./components/AboutPartner";
import data from "./data";
import { useQueryIndicator, useQueryNews } from "./hook";
import {  Space, Table, Tag  } from "antd";

const About = props => {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return (<Table columns={columns}  />)
};

const mapStateToProps = state => ({
  user: state.currentUser,
  channel: getChannel(state),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
