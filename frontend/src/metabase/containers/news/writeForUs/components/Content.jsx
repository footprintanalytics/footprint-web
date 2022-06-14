/* eslint-disable react/prop-types */

import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";

const Content = () => {
  return (
    <div className="news-us__content">
      <p />
      <span>
        If you’ve made it here we’re pretty certain it’s because you want to
        write for Footprint Analytics. That’s awesome! We are seeking both
        full-time and part-time contributors to join the team.
      </span>

      <div className="news-us__content-title footprint-title2">Who we are?</div>
      <div>
        <span>
          As you probably already know Footprint Analytics is not only an
          analysis platform to discover and visualize blockchain data, but also
          provide participants, investors, builders, platforms, and everyone
          else with reliable insights and highly useful and educational articles
          on any subject related to cryptocurrencies and blockchain projects to
          better participate in the crypto ecosystem.
        </span>
        <span>
          Our users and partners range from some of the most prominent analysts,
          investors, and crypto individuals to top organizations including
          Polygon, NEAR, BadgerDAO, mStable, and many more.
        </span>
        <p />
      </div>

      <div className="news-us__content-title footprint-title2">
        What are we looking for?
      </div>
      <div>
        <span>
          We would like to find writers who are passionate about blockchain and
          would like to share their interesting views on blockchain and any news
          they find valuable. Great at research and able to write in a clear
          manner about analytical or technical topics.
        </span>
      </div>

      <div className="news-us__content-sub-title footprint-primary-text text-bold">
        Things we would like to see:
      </div>
      <ul>
        <li>Word count: Between 500-2000 words.</li>
        <li>
          Tone: Inclusive, accessible and generally positive. Take a look around
          and see what we’ve previously posted.
        </li>
        <li>
          Original Content: The content must be unique and not posted elsewhere
          before or after submission.
        </li>
        <li>Use 2 or more Footprint Analytics data charts and links.</li>
      </ul>

      <div className="news-us__content-sub-title footprint-primary-text text-bold">
        We would like to stay away from:
      </div>
      <ul>
        <li>
          No Advertising: Reference links to other websites within the content
          are fine, but please do not add marketing links.
        </li>
        <li>
          Any offensive or insulting viewpoints that contain malicious intent.
        </li>
      </ul>

      <div className="news-us__content-title footprint-title2">
        How do you benefit?
      </div>
      <span>
        Working with Footprint Analytics provides you access to the following:
      </span>
      <p />

      <ul>
        <li>A place to share your views with the world.</li>
        <li>
          Access to our global audience of readers not only on Footprint
          Analytics, but also on other media platforms such as Yahoo,
          CoinMarketCap, CryptoSlate, CoinRivet etc.
        </li>
        <li>
          The chance to network and interact with our global community of
          partners and leaders in the blockchain space.
        </li>
        <li>
          Your commitment is flexible and you can submit content according to
          your own schedule.
        </li>
      </ul>

      <p />
      <span>
        Posts and the posting media, and will be chosen for publication at our
        discretion.
      </span>
      <p />

      <span>
        Feel free to reach out to us at{" "}
        <a
          href="mailto:analytics@footprint.network"
          onClick={() => {
            trackStructEvent("write-for-us bottom link");
          }}
        >
          analytics@footprint.network
        </a>
        . We look forward to hearing from you soon!
      </span>
    </div>
  );
};

export default Content;
