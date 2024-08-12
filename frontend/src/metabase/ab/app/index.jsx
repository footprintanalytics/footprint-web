/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import title from "metabase/hoc/Title";
import { Segmented, Tabs, Skeleton } from "antd";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getPeaToken } from "metabase/selectors/control";
import "./index.css";
import PeaPage from "metabase/ab/containers/PeaPage";
import { GiftOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { loginTelegram } from "metabase/auth/actions";
import { getPeaTokenAPI } from "metabase/new-service";
const { TabPane } = Tabs;

const Index = ({router, location, onChangeLocation, peaToken, loginTelegram}) => {
  const [height, setHeight] = useState(0);
  console.log("window", window, height)
  const [activeKey, setActiveKey] = useState("plaza");
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  // const other = `app_name=fga&token=${peaToken || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyNjkzMTdlZmYwMzAwMTE1MGU3MGUiLCJpYXQiOjE3MjI0ODE4MTAsImV4cCI6MTcyNTA3MzgxMH0.LlqLB3LSPEB8BBJVGlJ6MLAap1hj0zD_HChKvyon2hA"}`
  const other = `app_name=fga&token=${peaToken}`
  console.log("peaTokenpeaToken", peaToken)
  const tgAppTabs = [
    {
      icon: <GiftOutlined />,
      name: 'Plaza',
      value: 'plaza',
      url: `https://test.pea.ai/app?tab=plaza&${other}`
    },
    {
      icon: <ShoppingOutlined />,
      name: 'Community',
      value: 'community',
      url: `https://test.pea.ai/community?${other}`
    },
    {
      icon: <UserOutlined />,
      name: 'Account',
      value: 'account',
      url: `https://test.pea.ai/app?tab=account&${other}`
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setHeight(window.visualViewport ? window.visualViewport.height - 48 : window.innerHeight - 48);
      const app = window?.Telegram?.WebApp
      if (app) {
        console.log("window?.Telegram?.WebApp", app.initData)
      }
    }, 10)
  }, [])

  useEffect(() => {
    setActiveKey(type)
  }, [type]);

  const TabContent = () => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || "plaza";
    const url = tgAppTabs.find(i => i.value === type).url
    if (!height) {
      return <div>Loading...</div>
    }
    return (
      <PeaPage
        router={router}
        location={location}
        url={url}
        outerIframeHeight={height}
      />
    );
  };
  const onChange = (value) => {
    onChangeLocation(`/growthly/app?type=${value}`);
  };

  if (!peaToken) {
    return (<div className={"full-width full-height p4"}><Skeleton /></div>)
  }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 1 }}>
        <div style={{ flex: 1 }}>
            <TabContent />
        </div>
        <div >
          {/*<Radio.Group rootClassName={"fga-bottom-tabs"} value={activeKey} onChange={onChange} >
            <Radio.Button value="plaza">Plaza</Radio.Button>
            <Radio.Button value="community">Community</Radio.Button>
            <Radio.Button value="account">Account</Radio.Button>
          </Radio.Group>*/}
          <Segmented
            block
            className="w-full fga-bottom-tabs"
            size="small"
            value={activeKey}
            onChange={onChange}
            options={tgAppTabs?.map((tab) => {
              return {
                label: (
                  <div style={{ fontSize: 14 }} className={` ${tab.value === activeKey ? ' text-indigo-600' : ''}`}>
                    {tab.icon}
                    <div className={`-mt-0 ${tab.value === activeKey ? 'text-indigo-600' : ''}`} style={{ fontSize: 10 }}>
                      {tab.name}
                    </div>
                  </div>
                ),
                value: tab.value,
              }
            })}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: getUser(state),
  // peaToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmIxZjhjNDk0YzIzYjAwMTE3NmZkNTkiLCJhcHBLZXkiOiJmeVNFNVNtaXpGdE53YjY3WEVzNWc3QWpnSDFmekFZa1lZb0kwdDd0RGwiLCJvcGVuSWQiOiIyNjkxMyIsImlhdCI6MTcyMjkzOTU4OCwiZXhwIjoxNzI1NTMxNTg4fQ.xBjqXOd9Y3h_caVhLKDIjlxhXZuouGDiOXGPYriXWxA",
  peaToken: getPeaToken(state)
});

const mapDispatchToProps = {
  onChangeLocation: push,
  loginTelegram,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  MetaViewportControls,
  title(),
)(Index);
