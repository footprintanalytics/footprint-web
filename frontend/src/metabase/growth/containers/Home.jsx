/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { getUser } from "metabase/selectors/user";
import DashboardArea from "metabase/containers/features/components/DashboardArea";
import GaLayout from "../components/GaLayout";
import GaSidebar from "../components/GaSidebar";
import "../../containers/why/index.css";
import CreateProject from "./CreateProject";

const About = props => {
  const { router, location, children, user } = props;
  const [tab, setTab] = useState();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("project");
    }
  }, [location.query.tab]);
  return (
    <div className="defi-dashboard">
      <GaLayout
        router={router}
        location={location}
        // rightHeader={
        //   <Space>
        //     <DashboardSubmitProtocol />
        //     <DashboardSelectProtocol
        //       userMenu={userMenu}
        //       onChange={handleSelectProtocolChange}
        //     />
        //   </Space>
        // }
      >
        <Layout hasSider className="">
          <GaSidebar router={router}></GaSidebar>
          <Content style={{ marginLeft: 200 }}>
            {tab === "project" && (
              <CreateProject location={location} router={router} />
            )}
            {tab === "analytics" && (
              <DashboardArea
                location={location}
                className="w-full h-full"
                item={{
                  publicUuid: "f401aad0-a70a-4bcf-a1ba-8b6f964cdf70", //674c2c6d-6bb5-4171-962c-52a344008f5d
                  creatorId: "20103",
                }}
              />
            )}
            {tab === "activation" && (
              <DashboardArea
                location={location}
                item={{
                  publicUuid: "674c2c6d-6bb5-4171-962c-52a344008f5d", //
                  creatorId: "20103",
                }}
              />
            )}
          </Content>
        </Layout>
      </GaLayout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(About);
