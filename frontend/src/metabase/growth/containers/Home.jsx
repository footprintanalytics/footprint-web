/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { getUser } from "metabase/selectors/user";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { isProduction } from "metabase/env";
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

  const getDashboardId = current_tab => {
    switch (current_tab) {
      case "activation":
        return 6942;
      case "analytics":
        return 6939;
    }
  };
  return (
    <div className="defi-dashboard">
      <GaLayout router={router} location={location}>
        <Layout hasSider>
          <GaSidebar router={router} location={location}></GaSidebar>
          <Content style={{ marginLeft: 200 }}>
            {tab === "project" && (
              <CreateProject location={location} router={router} />
            )}
            {tab !== "project" && getDashboardId(tab) && (
              <PublicDashboard
                params={{ dashboardId: getDashboardId(tab) }}
                location={location}
                isFullscreen={false}
                className="ml-200"
                hideFooter
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
