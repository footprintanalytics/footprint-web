/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import title from "metabase/hoc/Title";
import Link from "metabase/core/components/Link";
import { Radio, Tabs } from "antd";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { State } from "metabase-types/store";
import { getUser } from "metabase/selectors/user";
import "./index.css"
import PeaPage from "metabase/ab/containers/PeaPage";

const { TabPane } = Tabs;

const Index = ({router, location, onChangeLocation}) => {
  const [height, setHeight] = useState(0);
  console.log("window", window, height)
  const [activeKey, setActiveKey] = useState("plaza");
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const other = "app_name=fga&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyNjkzMTdlZmYwMzAwMTE1MGU3MGUiLCJpYXQiOjE3MjI0ODE4MTAsImV4cCI6MTcyNTA3MzgxMH0.LlqLB3LSPEB8BBJVGlJ6MLAap1hj0zD_HChKvyon2hA"
  const data = {
    "plaza": {
      "title": "plaza",
      "url": `https://test.pea.ai/app?tab=plaza&${other}`
    },
    "community": {
      "title": "community",
      "url": `https://test.pea.ai/community?${other}`
    },
    "account": {
      "title": "account",
      "url": `https://test.pea.ai/app?tab=account&${other}`
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setHeight(window.visualViewport ? window.visualViewport.height - 66 : window.innerHeight - 66);
    }, 10)
  }, [])

  useEffect(() => {
    setActiveKey(type)
  }, [type]);

  const TabContent = () => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || "plaza";
    const url = data[type].url
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
  const onChange = (e) => {
    onChangeLocation(`/growth-fga/app?type=${e.target.value}`);
  };
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1 }}>
            <TabContent />
        </div>

        <div >
          <Radio.Group rootClassName={"fga-bottom-tabs"} value={activeKey} onChange={onChange} >
            <Radio.Button value="plaza">Plaza</Radio.Button>
            <Radio.Button value="community">Community</Radio.Button>
            <Radio.Button value="account">Account</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  MetaViewportControls,
  title(),
)(Index);
