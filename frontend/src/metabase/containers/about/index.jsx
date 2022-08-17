/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import AboutStart from "./components/AboutStart";
import AboutService from "./components/AboutService";
import AboutBuild from "./components/AboutBuild";
import AboutBacked from "./components/AboutBacked";
import AboutPartner from "./components/AboutPartner";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import { useQueryIndicator, useQueryNews } from "./hook";
import { connect } from "react-redux";
import AboutExploreDomain from "metabase/containers/about/components/AboutExploreDomain";
import AboutCreateDashboard from "metabase/containers/about/components/AboutCreateDashboard";
import Meta from "metabase/components/Meta";

const About = props => {
  const { children } = props;
  const { news } = useQueryNews();
  const { indicator } = useQueryIndicator();

  const defaultDesc =
    "Footprint is a powerful yet easy-to-use analytics tool to uncover and visualize blockchain data. The product puts user experience first whether you’re an analyst, data scientist, developer, student, teacher, or executive. It provides an intuitive, drag-and-drop interface for interactive data queries.";
  const keywords = "Footprint";
  const title = "Footprint Analytics: Crypto Analysis Dashboards";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <div className="About">
        <AboutStart indicator={indicator} />
        <AboutExploreDomain
          title={
            <h3>
              Explore <span className="About__title-bland">Chains</span> in
              Footprint
            </h3>
          }
          data={[
            { title: "Chains Covered", total: indicator?.chains },
            { title: "Chains Parsed", total: indicator?.chainsParsed },
          ]}
          className="About__explore-domain-bg"
          exploreButton={{
            title: "Explore More Chains ",
            url: "/",
            className: "About__btn--blue About__btn-radius",
          }}
          navListData={data.navListDataChain}
        />
        <AboutExploreDomain
          title={
            <h3>
              Explore <span className="About__title-light-blue">Games</span> in
              Footprint
            </h3>
          }
          data={[
            { title: "Chains Covered", total: indicator?.gamefiChains },
            { title: "Chains Parsed", total: indicator?.gamefiParsedChains },
            { title: "Games", total: indicator?.gamefiParsedProtocols },
          ]}
          className="About__explore-games-bg"
          dark={true}
          exploreButton={{
            title: "Explore Blockchain Games in Footprint ",
            url: "/",
            className: "About__btn--white About__btn-radius",
          }}
          navListData={data.navListDataGameFi}
        />
        <AboutExploreDomain
          title={
            <h3>
              Explore{" "}
              <span className="About__title-bland">NFT Collections</span> in
              Footprint
            </h3>
          }
          data={[
            { title: "Chains Covered", total: indicator?.nftChains },
            { title: "Chains Parsed", total: indicator?.nftParsedChains },
            { title: "Marketplaces", total: indicator?.nftParsedMarketplaces },
            { title: "NFT Collections", total: indicator?.nftCollections },
          ]}
          className="About__explore-nft-bg"
          exploreButton={{
            title: "Explore More Collections ",
            url: "/",
            className: "About__btn--blue About__btn-radius",
          }}
          navListData={data.navListDataNft}
        />
        <AboutCreateDashboard
          title={
            <h3>
              Create <span className="About__title-bland">Dashboards</span>{" "}
              Using Footprint
            </h3>
          }
          list={data.sectionList}
          data={[
            { title: "Community Dashboards", total: indicator?.dashboards },
            { title: "Community Charts", total: indicator?.charts },
          ]}
          className={"About__create-dashboard About__create-dashboards-bg"}
        />
        <AboutService />

        <AboutCreateDashboard
          list={data.sectionListDataApi}
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
        {children}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

export default connect(mapStateToProps)(About);
