/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
import AboutHeader from "./components/AboutHeader";
import AboutStart from "./components/AboutStart";
import AboutCover from "./components/AboutCover";
import AboutSection from "./components/AboutSection";
import AboutService from "./components/AboutService";
import AboutBuild from "./components/AboutBuild";
import AboutBacked from "./components/AboutBacked";
import AboutPartner from "./components/AboutPartner";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import { useQueryDashboard, useQueryNews, useQueryIndicator } from "./hook";
import { connect } from "react-redux";

const About = props => {
  const defaultDashboardQuery = data.dashboardNav[0].query;
  const [dashboardQuery, setDashboardQuery] = useState(defaultDashboardQuery);
  const { dashboard, isLoading } = useQueryDashboard({ query: dashboardQuery });
  const { news } = useQueryNews();
  const { indicator } = useQueryIndicator();

  return (
    <div className="About">
      <AboutHeader
        router={props.router}
        location={props.location}
        user={props.user}
      />
      <AboutStart />
      <AboutCover indicator={indicator} />
      {data.sectionList.map(item => (
        <AboutSection
          key={item.subTitle}
          reverse={item.reverse}
          borderless={item.borderless}
          title={item.title}
          subTitle={item.subTitle}
          desc={item.desc}
          list={item.list}
          height={item.height}
        />
      ))}
      <AboutService />
      <AboutBuild
        title="What you can build"
        nav={data.dashboardNav}
        list={dashboard}
        onNavChange={setDashboardQuery}
        isLoading={isLoading}
        more="/dashboards"
      />
      <AboutBuild
        type="card"
        title="Explore Footprint"
        list={news}
        more="/news/featured"
      />
      <AboutBacked list={data.backedList} />
      <AboutPartner list={data.partnerList} />
      <HomeFooter />
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

export default connect(mapStateToProps)(About);
