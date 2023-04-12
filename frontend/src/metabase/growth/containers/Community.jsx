/* eslint-disable react/prop-types */
import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";

const Community = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  return (
    <div className="flex flex-column items-center w-full p2">
      <Row gutter={16} className="w-full">
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Wallets"
              value={1128}
              precision={2}
              // valueStyle={{ color: "#3f8600" }}
              // prefix={<ArrowUpOutlined />}
              // suffix="%"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Twitter Followers"
              value={923}
              precision={2}
              // valueStyle={{ color: "#cf1322" }}
              // prefix={<ArrowDownOutlined />}
              // suffix="%"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Discord Members"
              value={623}
              precision={2}
              // valueStyle={{ color: "#cf1322" }}
              // prefix={<ArrowDownOutlined />}
              // suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props?.params?.project,
    projectObject: getFgaProject(state),
    menu: props?.params?.menu,
  };
};

export default connect(mapStateToProps)(Community);
