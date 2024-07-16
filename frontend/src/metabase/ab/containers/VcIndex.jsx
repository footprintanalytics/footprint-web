/* eslint-disable react/prop-types */
import React, {useState} from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import GaSidebar from "metabase/ab/components/GaSidebar";
import { Content } from "antd/lib/layout/layout";
import { Layout } from "antd";
import { fga_menu_data_v2, getDashboardMap } from "metabase/ab/utils/data";
import PublicDashboard from "metabase/public/containers/PublicDashboard";

const VcIndex = props => {
  const { router, location, children, user,  } =
    props;
  const data = fga_menu_data_v2("vc", null, null, user)
  const [uuid, setUuid] = useState("1188d812-d694-4351-890b-96ca1f3cbca9");
  const [menu, setMenu] = useState("defi_ranking");
  const dashboardMapping = data.dashboardMap;
  return (
    <Layout
      hasSider
      className={`ga-layout ab-page h-full`}
      style={{ backgroundColor: "#101014" }}
    >
      <GaSidebar
        businessType="vc"
        currentMenu={menu}
        selectCallback={(data) => {
          setUuid(dashboardMapping.get(data.key))
          setMenu(data.key)
          console.log("data", data)
        }}
      />
      <Content
        className="h-full ga-layout__content"
        // style={{ marginLeft: props.isChart ? 0 : 250 }}
      >
        <PublicDashboard
          params={{ uuid }}
          location={location}
          router={router}
          isFullscreen={false}
          hideTitle={true}
          hideFooter
        />
      </Content>
    </Layout>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
  };
};

export default connect(mapStateToProps)(VcIndex);
