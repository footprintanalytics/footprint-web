/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/components/Link";
import { Image, Skeleton } from "antd";
import { RightOutlined } from "@ant-design/icons";

const DataApiNFT = () => {
  return (
    <div className="data-api__get-start data-api__get-start-nft-bg">
      <div className="data-api__box">
        <div className="data-api__get-start-box-container">
          <Image
            placeholder={<Skeleton active />}
            preview={false}
            src={getOssUrl("img_da_bg_2022100862.png?2=2")}
          />
          <div className="data-api__get-start-box-main">
            <h3>
              All cross-chain <br />
              <span className="data-api__text-bland">NFT API</span>
            </h3>
            <span className="data-api__get-start-desc">
              Fetch NFT ownership, transfer, price, <br />
              orderbook, and metadata and more, <br />
              making it easy to build NFT applications <br />
              instantly.
            </span>
            <Link
              to="https://fp-api.readme.io/reference/get_chain-list"
              target="_blank"
            >
              <Button className="data-api__button-bland">
                Learn more <RightOutlined className="ml1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataApiNFT;
