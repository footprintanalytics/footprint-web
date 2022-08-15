/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
import AboutHeader from "./components/AboutHeader";
import AboutStart from "./components/AboutStart";
import AboutService from "./components/AboutService";
import AboutBuild from "./components/AboutBuild";
import AboutBacked from "./components/AboutBacked";
import AboutPartner from "./components/AboutPartner";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import { useQueryDashboard, useQueryIndicator, useQueryNews } from "./hook";
import { connect } from "react-redux";
import AboutExploreChains from "metabase/containers/about/components/AboutExploreChains";
import AboutCreateDashboard from "metabase/containers/about/components/AboutCreateDashboard";

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
      <AboutExploreChains
        title="Explore Chains in Footprint"
        data={[
          { title: "Chains covered", value: 123 },
          { title: "Chains Parsed", value: 17 },
        ]}
        exploreButton={{
          title: "Explore More Chain Analytics >",
          url: "/",
          className: "About__btn--blue About__btn-radius",
        }}
      />
      <AboutExploreChains
        title="Explore Games in Footprint"
        data={[
          { title: "chains", value: 17 },
          { title: "Games", value: 3000 },
        ]}
        className="About__explore-games-bg"
        dark={true}
        exploreButton={{
          title: "Explore More games >",
          url: "/",
          className: "About__btn--white About__btn-radius",
        }}
      />
      <AboutExploreChains
        title="Explore NFT Collections in Footprint"
        data={[
          { title: "chains", value: 17 },
          { title: "Marketplace", value: 3000 },
          { title: "NFT Collections", value: 3000 },
        ]}
        exploreButton={{
          title: "Explore More Collections >",
          url: "/",
          className: "About__btn--blue About__btn-radius",
        }}
      />
      {/*<AboutCover indicator={indicator} />*/}

      <AboutCreateDashboard
        list={data.sectionList}
        data={[
          { title: "Community Dashboards", value: 5000 },
          { title: "Community Charts", value: 24900 },
        ]}
        className={"About__create-dashboard"}
        title={"Create Dashboards Using Footprint"}
      />
      <AboutService />

      <AboutCreateDashboard
        list={data.sectionList2}
        className={"About__create-nft"}
        title={"Use Data API to Built Your Application"}
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
