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
import AboutExploreDomain from "metabase/containers/about/components/AboutExploreDomain";
import AboutCreateDashboard from "metabase/containers/about/components/AboutCreateDashboard";

const About = props => {
  // const defaultDashboardQuery = data.dashboardNav[0].query;
  // const [dashboardQuery, setDashboardQuery] = useState(defaultDashboardQuery);
  // const { dashboard, isLoading } = useQueryDashboard({ query: dashboardQuery });
  const { news } = useQueryNews();
  const { indicator } = useQueryIndicator();
  console.log("indicator", indicator);
  console.log("news", news);
  return (
    <div className="About">
      <AboutStart indicator={indicator} />
      <AboutExploreDomain
        title={
          <div>
            Explore <span className="About__title-bland">Chains</span> in
            Footprint
          </div>
        }
        data={[
          { title: "Chains Covered", total: indicator?.chains },
          { title: "Chains Parsed", total: indicator?.chainsParsed },
        ]}
        className="About__explore-domain-bg"
        exploreButton={{
          title: "Explore More Chain Analytics >",
          url: "/",
          className: "About__btn--blue About__btn-radius",
        }}
      />
      <AboutExploreDomain
        title={<div>Explore Games in Footprint</div>}
        data={[
          { title: "Chains Covered", total: indicator?.gamefiChains },
          { title: "Chains Parsed", total: indicator?.gamefiParsedChains },
          { title: "Games", total: indicator?.gamefiParsedProtocols },
        ]}
        className="About__explore-games-bg"
        dark={true}
        exploreButton={{
          title: "Explore More games >",
          url: "/",
          className: "About__btn--white About__btn-radius",
        }}
      />
      <AboutExploreDomain
        title={
          <div>
            Explore <span className="About__title-bland">NFT Collections</span>{" "}
            in Footprint
          </div>
        }
        data={[
          { title: "Chains Covered", total: indicator?.nftChains },
          { title: "Chains Parsed", total: indicator?.nftParsedChains },
          { title: "Marketplace", total: indicator?.nftParsedMarketplaces },
          { title: "NFT Collections", total: indicator?.nftCollections },
        ]}
        className="About__explore-nft-bg"
        exploreButton={{
          title: "Explore More Collections >",
          url: "/",
          className: "About__btn--blue About__btn-radius",
        }}
      />
      <AboutCreateDashboard
        title={
          <div>
            Create <span className="About__title-bland">Dashboards</span> Using
            Footprint
          </div>
        }
        list={data.sectionList}
        data={[
          { title: "Community Dashboards", total: indicator?.dashboards },
          { title: "Community Charts", total: indicator?.charts },
        ]}
        className={"About__create-dashboard"}
      />
      <AboutService />

      <AboutCreateDashboard
        title={
          <div>
            Use <span className="About__title-bland">Data API</span> to Built
            Your Application
          </div>
        }
        list={data.sectionList2}
        className={"About__create-nft"}
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
