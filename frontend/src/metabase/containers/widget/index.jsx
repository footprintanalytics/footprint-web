/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router";
import { getOssUrl } from "../../lib/image";
import Best from "metabase/containers/why/components/Best";
import Partners from "metabase/containers/why/components/Partners";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import Meta from "metabase/components/Meta";
import "./index.css";
import "../../containers/why/index.css";
import { trackStructEvent } from "metabase/lib/analytics";

const Widget = () => {
  return (
    <div className="widget">
      <Meta
        title="Footprint Widgets"
        description="Data Visualization Components. No coding. 2 steps to show data on your website. GameFi, NFT, DeFi and Token data are available.
        Support multiple templates and custom configuration is available."
      />
      <div className="widget__banner">
        <div
          className="widget__banner-bg"
          style={{ backgroundImage: `url(${getOssUrl("20220225172555.png")})` }}
        />
        <h2>
          Footprint Widgets
          <br />
          Data Visualization Components
        </h2>
        <div className="widget__banner-btns">
          <Link
            className="widget-btn widget-btn--white"
            href="https://www.footprint.network/public/dashboard/Analysis-of-Crypto-Assets-and-Capital-Markets-fp-66f409c3-5b63-42ef-8201-92b527b93651?date=past90days&token_symbol=Bitcoin(BTC)"
            target="_blank"
            onClick={() =>
              trackStructEvent("Footprint Widgets", "Watch a quick demo")
            }
          >
            Watch a quick demo
          </Link>
          <Link
            className="widget-btn widget-btn--plain"
            href="https://discord.gg/3HYaR6USM7"
            target="_blank"
            onClick={() => trackStructEvent("Footprint Widgets", "Contact us")}
          >
            Contact us
          </Link>
        </div>
        <iframe
          className="widget__banner-demo"
          src="https://www.footprint.network/public/dashboard/Analysis-of-Crypto-Assets-and-Capital-Markets-fp-66f409c3-5b63-42ef-8201-92b527b93651?date=past90days&token_symbol=Bitcoin(BTC)"
          frameBorder="0"
          width="900"
          height="600"
        />
        <div>
          <p className="widget-quote">
            No coding. 2 steps to show data on your website. GameFi, NFT, DeFi
            and Token data are available.
            <br />
            Support multiple templates and custom configuration is available.
          </p>
        </div>
      </div>

      <div className="widget__wrap widget-my-120 widget-flex">
        <AboutSectionInfo
          title={<h3>Supported GameFi, DeFi, NFT, Token Data</h3>}
          desc={
            <p>
              100,000+ Tokens, 100+ Chains,
              <br />
              4000+ Protocols, 500+ NFTs...
            </p>
          }
        />
        <img
          src={getOssUrl("20220225185345.png")}
          width={800}
          alt="Supported GameFi, DeFi, NFT, Token Data"
        />
      </div>

      <div className="widget__wrap widget-my-120 widget-flex">
        <img
          src={getOssUrl("20220225193041.png")}
          width={775}
          alt="Massive Indicators"
        />
        <AboutSectionInfo
          title={<h3>Massive Indicators</h3>}
          desc={
            <p>
              New user, Active user, User retention,
              <br />
              Top 10 users, inflow & outflow address,
              <br />
              Tags, TVL, Trading volume, Transaction...
            </p>
          }
        />
      </div>

      <div className="widget__wrap widget-my-120 widget-flex">
        <AboutSectionInfo
          title={<h3>3 Steps, 1 Minute</h3>}
          desc={
            <p>
              No coding. Create data charts by drag-drop. 16+ chats type are
              available.
              <br />
              Copy and paste snippet on your website or blog posts
            </p>
          }
        />
        <img
          className="widget__shadow"
          src={getOssUrl("202205091348778.png")}
          width={500}
          alt="3 Steps, 1 Minute"
        />
      </div>

      <div
        className="widget-why"
        style={{ backgroundImage: `url(${getOssUrl("202202261501793.png")})` }}
      >
        <div className="widget__wrap">
          <h3>100+ customers have already chosen Footprint</h3>
          <p style={{ textAlign: "center", margin: "-60px 0 20px 0" }}>
            We have partnered with 100+ of the top companies in the crypto
            industry, including some of the most recognized exchanges,
            <br /> wallets, data providers, and news sites to bring our
            analytics to their users
          </p>
          <ul>
            <li>
              <img
                src={getOssUrl("202202261500683.png")}
                height={50}
                alt="Embed"
              />
              <p>Embed</p>
            </li>
            <li style={{ marginLeft: 40 }}>
              <img
                src={getOssUrl("202202261500545.png")}
                height={50}
                alt="API (Coming Soon)"
              />
              <p>API (Coming Soon)</p>
            </li>
          </ul>
        </div>
      </div>

      <Best />
      <Partners />
      <HomeFooter />
    </div>
  );
};

const AboutSectionInfo = ({ title, desc, hideLink }) => {
  return (
    <div
      className={`widget__section-info ${
        hideLink ? "widget__section-info--nolink" : ""
      }`}
    >
      <div className="widget__section-info-title">{title}</div>
      <div className="widget__section-info-desc">{desc}</div>
      {!hideLink && (
        <Link
          className="widget__section-info-link"
          href="https://discord.gg/3HYaR6USM7"
          target="_blank"
          onClick={() => trackStructEvent("Footprint Widgets", "Contact us")}
        >
          Contact us
          <img
            src={getOssUrl("20220225191417.png")}
            width={16}
            height={10}
            alt="Contact us"
          />
        </Link>
      )}
    </div>
  );
};

export default Widget;
