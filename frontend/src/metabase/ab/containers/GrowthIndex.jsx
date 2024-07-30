/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import GaSidebar from "metabase/ab/components/GaSidebar";
import { Content } from "antd/lib/layout/layout";
import { Image, Layout, Result, Skeleton } from "antd";
import { fga_menu_data_v2, getDashboardMap } from "metabase/ab/utils/data";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { push } from "react-router-redux";
import { useQuery } from "react-query";
import { getPeaToken, publicDashboard } from "metabase/new-service";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import PeaPage from "metabase/ab/containers/PeaPage";

const GrowthIndex = props => {
  const { router, location, currentMenu, user, onChangeLocation } =
    props;
  const data = fga_menu_data_v2("growth", null, null, user)

  const [uuid, setUuid] = useState("/community/bevm");
  const [menu, setMenu] = useState("c-detail");
  const dashboardMapping = data.dashboardMap;
  const pageParam = "?partner_id=fga&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE4YjVkNDI0ODk5YTAwMTJkNDVjYzAiLCJhcHBLZXkiOiJmeVNFNVNtaXpGdE53YjY3WEVzNWc3QWpnSDFmekFZa1lZb0kwdDd0RGwiLCJvcGVuSWQiOiI2MGYxMmEwOTJiZDI4NDAwMWUzM2FlNWMiLCJpYXQiOjE3MjIzMzI2MjgsImV4cCI6MTcyNDkyNDYyOH0.wJh5j8wXeUit3VF8sp5Zxsj0PVauwkhh2OM2UWuUHrQ";
  const url = `https://test.pea.ai/${uuid}${pageParam}`

  console.log("vvvvvvvv1", uuid)
  console.log("vvvvvvvv33333", url)
  useEffect(() => {
    if (currentMenu) {
      setUuid(dashboardMapping.get(currentMenu))
      setMenu(currentMenu)
    } else {
      setUuid("/community/bevm")
      setMenu("c-detail")
    }
  }, [currentMenu, dashboardMapping]);

  const { isLoading, data: peaData } = useQuery(
    ["getPeaToken"],
    async () => {
      return await getPeaToken();
    },
    {...QUERY_OPTIONS_NORMAL, enabled: !!user },
  );
  console.log("xxxxxxmenu", menu)
  if (isLoading) {
    return <div className={"p4"}><Skeleton /></div>
  }

  return (
    <Layout
      hasSider
      className={`ga-layout ab-page h-full`}
      style={{ backgroundColor: "#101014" }}
    >
      <GaSidebar
        businessType="growth"
        currentMenu={menu}
        selectCallback={(data) => {
          onChangeLocation(`/growth-fga/${data.key}`)
        }}
      />
      <Content
        className="h-full ga-layout__content flex justify-center"
        // style={{ marginLeft: props.isChart ? 0 : 250 }}
      >
        <PeaPage url={url}/>
        {/*{uuid && <PublicDashboard*/}
        {/*  params={{ uuid }}*/}
        {/*  location={location}*/}
        {/*  router={router}*/}
        {/*  isFullscreen={false}*/}
        {/*  hideTitle={true}*/}
        {/*  hideFooter*/}
        {/*/>}*/}
        {/*{!uuid && <Result*/}
        {/*  style={{*/}
        {/*    margin: 0,*/}
        {/*    width: "50%",*/}
        {/*    minWidth: 400,*/}
        {/*    maxWidth: 600,*/}
        {/*  }}*/}
        {/*  icon={*/}
        {/*    <Image*/}
        {/*      preview={false}*/}
        {/*      style={{*/}
        {/*        height: "50%",*/}
        {/*        width: "50%",*/}
        {/*        minHeight: 30,*/}
        {/*        minWidth: 50,*/}
        {/*        maxHeight: 500,*/}
        {/*        maxWidth: 550,*/}
        {/*      }}*/}
        {/*      src={*/}
        {/*        "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"*/}
        {/*      }*/}
        {/*    />*/}
        {/*  }*/}
        {/*  // title="There is currently no data available for this project."*/}
        {/*  // subTitle={`I'm sorry, the content for this ${page} page is not yet ready. You can visit our homepage for now and stay tuned for more high-quality content coming soon. We appreciate your patience.`}*/}
        {/*  title="Coming Soon~"*/}
        {/*/>*/}
        {/*}*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(GrowthIndex);
