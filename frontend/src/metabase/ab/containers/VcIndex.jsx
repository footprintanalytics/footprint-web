/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import GaSidebar from "metabase/ab/components/GaSidebar";
import { Content } from "antd/lib/layout/layout";
import { Image, Layout, Result } from "antd";
import { fga_menu_data_v2, getDashboardMap } from "metabase/ab/utils/data";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { push } from "react-router-redux";

const VcIndex = props => {
  const { router, location, currentMenu, user, onChangeLocation } =
    props;
  const data = fga_menu_data_v2("vc", null, null, user)
  const [uuid, setUuid] = useState("1188d812-d694-4351-890b-96ca1f3cbca9");
  const [menu, setMenu] = useState("defi_ranking");
  const dashboardMapping = data.dashboardMap;
  useEffect(() => {
    if (currentMenu) {
      setUuid(dashboardMapping.get(currentMenu))
      setMenu(currentMenu)
    } else {
      setUuid("1188d812-d694-4351-890b-96ca1f3cbca9")
      setMenu("defi_ranking")
    }
  }, [currentMenu, dashboardMapping]);
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
          onChangeLocation(`/portfolio-fga/${data.key}`)
        }}
      />
      <Content
        className="h-full ga-layout__content flex justify-center"
        // style={{ marginLeft: props.isChart ? 0 : 250 }}
      >
        {uuid && <PublicDashboard
          params={{ uuid }}
          location={location}
          router={router}
          isFullscreen={false}
          hideTitle={true}
          hideFooter
        />}
        {!uuid && <Result
          style={{
            margin: 0,
            width: "50%",
            minWidth: 400,
            maxWidth: 600,
          }}
          icon={
            <Image
              preview={false}
              style={{
                height: "50%",
                width: "50%",
                minHeight: 30,
                minWidth: 50,
                maxHeight: 500,
                maxWidth: 550,
              }}
              src={
                "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"
              }
            />
          }
          // title="There is currently no data available for this project."
          // subTitle={`I'm sorry, the content for this ${page} page is not yet ready. You can visit our homepage for now and stay tuned for more high-quality content coming soon. We appreciate your patience.`}
          title="Coming Soon~"
        />
        }
      </Content>
    </Layout>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    currentMenu: props.params.menu,
  };
};
const mapDispatchToProps = {
  onChangeLocation: push,
};
export default connect(mapStateToProps, mapDispatchToProps)(VcIndex);
