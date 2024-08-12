/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import title from "metabase/hoc/Title";
import { Skeleton, Tabs } from "antd";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getPeaToken } from "metabase/selectors/control";
import "./index.css";
import PeaPage from "metabase/ab/containers/PeaPage";
import { loginTelegram } from "metabase/auth/actions";
import { getPeaHost } from "metabase/ab/utils/utils";

const Hub = ({router, location, onChangeLocation, peaToken, loginTelegram}) => {
  const [height, setHeight] = useState(0);
  const tgWebAppStartParam = location?.query?.tgWebAppStartParam
  const type = location?.query?.type
  console.log("tgWebAppStartParam", tgWebAppStartParam)
  const other = `app_name=fga&token=${peaToken}`
  console.log("peaTokenpeaToken", peaToken)
  const getQuestWebUrl = () => {
    switch (type) {
      case 'lucky_draw':
        return `/app/campaign/lucky_draw`
      case 'instant_draw':
        return `/app/campaign/instant_draw`
      case 'fission_lucky_money':
        return `/app/quest/lucky_money`
      case 'normal':
      default:
        return `/campaign/detail`
    }
  }
  const questUrl = getQuestWebUrl(type)
  const url = `${getPeaHost()}${questUrl}?tgWebAppStartParam=${tgWebAppStartParam}&${other}`

  useEffect(() => {
    setTimeout(() => {
      setHeight(window.visualViewport ? window.visualViewport.height - 48 : window.innerHeight - 48);
      const app = window?.Telegram?.WebApp
      if (app) {
        console.log("window?.Telegram?.WebApp", app.initData)
      }
    }, 10)
  }, [])

  if (!peaToken) {
    return (<div className={"full-width full-height p4"}><Skeleton /></div>)
  }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 1 }}>
        <PeaPage
          router={router}
          location={location}
          url={url}
          outerIframeHeight={height}
        />
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
)(Hub);
