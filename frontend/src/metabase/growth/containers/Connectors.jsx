/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { Collapse, Switch, Tooltip } from "antd";
import { getUser } from "metabase/selectors/user";
import AF from "assets/img/af.png";
import BQ from "assets/img/BQ.svg";
import GA from "assets/img/GA.svg";
const { Panel } = Collapse;
import ConfigGoogleAnalyticsSource from "../components/config_panel/ConfigGoogleAnalyticsSource";
import ConfigBigQuerySource from "../components/config_panel/ConfigBigQuerySource";
import ConfigAppsFlyerSource from "../components/config_panel/ConfigAppsFlyerSource";
import ConfigTwitterSource from "../components/config_panel/ConfigTwitterSource";
import ConfigDiscordSource from "../components/config_panel/ConfigDiscordSource";
import "../css/utils.css";

const Connectors = props => {
  const { router, location, children, user } = props;

  const onChange = key => {
    console.log(key);
    setSelectSendType(key);
  };

  const [selectSendType, setSelectSendType] = useState(["ga"]);

  return (
    <div className=" flex flex-column items-center">
      <Collapse
        activeKey={selectSendType}
        onChange={onChange}
        maxWidth={800}
        minWidth={600}
        style={{ width: 600, margin: 20, borderRadius: 10 }}
      >
        <Panel
          showArrow={false}
          header={
            <div className="flex flex-row items-center">
              <img src={GA} className="ga-icon" />
              Google Analytics
            </div>
          }
          key="ga"
          extra={
            <Tooltip title={"Enable Google Analytics Connector"}>
              <Switch
                defaultChecked
                // checked={selectSendType === "ga" ? true : false}
                onClick={(checked, event) => {
                  event.stopPropagation();
                  if (checked) {
                    // setSelectSendType("ga");
                  }
                }}
              />
            </Tooltip>
          }
        >
          <ConfigGoogleAnalyticsSource />
        </Panel>
        <Panel
          showArrow={false}
          header={
            <div className="flex flex-row items-center">
              <img src={BQ} className="ga-icon" />
              BigQuery
            </div>
          }
          key="bq"
          extra={
            <Tooltip title={"Enable BigQuery Connector"}>
              <Switch
                // checked={selectSendType === "bq" ? true : false}
                onClick={(checked, event) => {
                  event.stopPropagation();
                  if (checked) {
                    // setSelectSendType("bq");
                  }
                }}
              />
            </Tooltip>
          }
        >
          <ConfigBigQuerySource />
        </Panel>
        <Panel
          showArrow={false}
          header={
            <div className="flex flex-row items-center">
              <img src={AF} className="ga-icon" />
              Appsflyer
            </div>
          }
          key="af"
          extra={
            <Tooltip title={"Enable AppsFlyer Connector"}>
              <Switch
                // checked={selectSendType === "af" ? true : false}
                onClick={(checked, event) => {
                  event.stopPropagation();
                  if (checked) {
                    // setSelectSendType("af");
                  }
                }}
              />
            </Tooltip>
          }
        >
          <ConfigAppsFlyerSource />
        </Panel>
        <Panel
          showArrow={false}
          header={
            <div className="flex flex-row items-center">
              <img
                src={
                  "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png"
                }
                className="ga-icon"
              />
              Discord
            </div>
          }
          key="discord"
          extra={
            <Tooltip title={"Enable Discord Connector"}>
              <Switch
                // checked={selectSendType === "discord" ? true : false}
                onClick={(checked, event) => {
                  event.stopPropagation();
                  if (checked) {
                    // setSelectSendType("discord");
                  }
                }}
              />
            </Tooltip>
          }
        >
          <ConfigDiscordSource />
        </Panel>
        <Panel
          showArrow={false}
          header={
            <div className="flex flex-row items-center">
              <img
                src={
                  "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png"
                }
                className="ga-icon"
              />
              Twitter
            </div>
          }
          key="twitter"
          extra={
            <Tooltip title={"Enable Twitter Connector"}>
              <Switch
                // checked={selectSendType === "twitter" ? true : false}
                onClick={(checked, event) => {
                  event.stopPropagation();
                  if (checked) {
                    // setSelectSendType("twitter");
                  }
                }}
              />
            </Tooltip>
          }
        >
          <ConfigTwitterSource />
        </Panel>
      </Collapse>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Connectors);
