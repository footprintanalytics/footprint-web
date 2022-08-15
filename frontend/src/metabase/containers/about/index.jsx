/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
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
      <AboutStart />
      <AboutExploreChains
        title="Explore Chains in Footprint"
        data={[
          { title: "Chains Covered", value: 134 },
          { title: "Chains Parsed", value: 17 },
        ]}
        className="About__explore-chains-bg"
        exploreButton={{
          title: "Explore More Chain Analytics >",
          url: "/",
          className: "About__btn--blue About__btn-radius",
        }}
      />
      <AboutExploreChains
        title="Explore Games in Footprint"
        data={[
          { title: "Chains Covered", value: 42 },
          { title: "Chains Parsed", value: 15 },
          { title: "Games", value: 1364 },
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
          { title: "Chains Covered", value: 11 },
          { title: "Chains Parsed", value: 3 },
          { title: "Marketplace", value: 11 },
          { title: "NFT Collections", value: 126551 },
        ]}
        className="About__explore-nft-bg"
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
          { title: "Community Dashboards", value: 5212 },
          { title: "Community Charts", value: 25806 },
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
