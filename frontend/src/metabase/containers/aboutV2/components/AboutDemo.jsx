/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDemo = () => {
  return (
    <div className="About__demo">
      <div className="About__demo-growth-analytics">
        <div className="About__demo-growth-analytics-left">
          <h3>Growth Analytics</h3>
          <h4>One platform for your team and user growth</h4>
          <span>Dive into data insights and get an edge in your marketing strategy with <br/>Footprint GA by bringing all of your Web2 and Wed3 data sources together.</span>
          <AboutButton
            className="mt4"
            buttonText="Explore Footprint GA"
            link="https://www.footprint.network/growth"
          />
        </div>
        <AboutImage className="About__demo-growth-analytics-image" src={getOssUrl("home-v2/img_growth_analytics.png")} alt="Growth Analytics" />
      </div>
      <div className="About__demo-bottom">
        <div className="About__demo-analytics-app">
          <h3>Analytics APP</h3>
          <h4>Zero coding analytics as Tableau for crypto</h4>
          <span>Use Footprint real-time on-chain data and uploaded data to build charts and dashboards that showcase cutting-edge blockchain market insights without code using a drag-and-drop interface as well as with SQL.</span>
          <AboutButton
            className="mt4 mb4"
            buttonText="Explore Analytics APP"
            link="https://www.footprint.network/dashboards"
          />
          <AboutImage className="About__demo-long-app-container" src={getOssUrl("home-v2/img_analytics_app.png")} alt="Analytics APP" />
        </div>
        <div className="About__demo-data-api">
          <h3>Data API</h3>
          <h4>Build your application with the Data API</h4>
          <span>A unified data API for NFTs, GameFi, and DeFi across all major chain <br/>ecosystems. <br/>Support not only raw data but also statistics metrics with one line of code.</span>
          <div className="About__demo-data-api-buttons">
            <AboutButton
              className="mt4 mb4"
              buttonText="Explore Data API"
              link="https://www.footprint.network/data-api"
            />
            <AboutButton
              className="mt4 mb4"
              buttonText="Explore Batch API"
              link="https://www.footprint.network/batch-download"
            />
          </div>
          <AboutImage className="About__demo-long-api-container" src={getOssUrl("home-v2/img_data_api_v2.png")} alt="Data API" />
        </div>
      </div>
    </div>
  );
};

export default AboutDemo;
