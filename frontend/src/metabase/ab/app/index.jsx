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
import { GiftOutlined, ShoppingOutlined, UserOutlined, SlidersOutlined } from "@ant-design/icons";
import { loginTelegram } from "metabase/auth/actions";
import { getPeaTokenAPI } from "metabase/new-service";
import { getPeaHost } from "metabase/ab/utils/utils";
const { TabPane } = Tabs;

const Index = ({router, location, onChangeLocation, peaToken, loginTelegram}) => {
  const [height, setHeight] = useState(0);
  const [activeKey, setActiveKey] = useState("plaza");
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const other = `app_name=fga&token=${peaToken}`
  console.log("peaTokenpeaToken", peaToken)
  const tgAppTabs = [
    {
      icon: <GiftOutlined />,
      name: 'Plaza',
      value: 'plaza',
      url: `${getPeaHost()}/app?tab=plaza&${other}`
    },
    {
      icon: <SlidersOutlined />,
      name: 'Community',
      value: 'community',
      url: `${getPeaHost()}/community?${other}`
    },
    {
      icon: <ShoppingOutlined />,
      name: 'Earn',
      value: 'earn',
      url: `${getPeaHost()}/app?tab=earn&${other}`
    },
    {
      icon: <UserOutlined />,
      name: 'Account',
      value: 'account',
      url: `${getPeaHost()}/app?tab=account&${other}`
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
