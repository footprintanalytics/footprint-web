/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/components/Link";
import { Image, Skeleton } from "antd";

const DataApiGetStart = () => {
  return (
    <div className="data-api__get-start data-api__get-start-chain-bg">
      <h1>
        Get started with Footprint{" "}
        <span className="data-api__text-bland">Data API</span>
      </h1>
      <h2>Read our documentation to find out how:</h2>
      <div className="data-api__box">
        <div className="data-api__get-start-box-container">
          <div className="data-api__get-start-box-main">
            <h3>
              Fully access to <br />
              <span className="data-api__text-bland">Chain API</span>
            </h3>
            <span className="data-api__get-start-desc">
              Covering most chains and support from <br />
              raw data to analytics metrics
            </span>
            <Link
              to="https://fp-api.readme.io/reference/get_nft-chain-collection-collection-contract-address-info"
              target="_blank"
            >
              <Button className="data-api__button-bland">
                {"Learn more >>>"}
              </Button>
            </Link>
          </div>
          <Image
            placeholder={<Skeleton active />}
            preview={false}
            src={getOssUrl("img_da_bg_2022100861.png")}
          />
        </div>
      </div>
    </div>
  );
};

export default DataApiGetStart;
