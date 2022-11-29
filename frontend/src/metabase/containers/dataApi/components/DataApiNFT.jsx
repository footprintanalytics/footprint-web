/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/core/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
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
              Cross-chain <br />
              <span className="data-api__text-bland">NFT API</span>
            </h3>
            <span className="data-api__get-start-subtitle">
              14 marketplaces <br /> and 101,639 collections
            </span>
            <span className="data-api__get-start-desc">
              Fetch NFT ownership, transfer, price, orderbook, <br />
              metadata, and more, making it easy <br />
              to build NFT applications instantly.
            </span>
            <div className="data-api__buttons">
              <Link
                to="https://docs.footprint.network/reference/get_nft-chain-collection-collection-contract-address-transactions"
                target="_blank"
              >
                <Button className="data-api__button-bland">
                  Learn more <RightOutlined className="ml1" />
                </Button>
              </Link>
              <Link to="/data-api/product">
                <Button className="data-api__button-white">
                  Uses case <RightOutlined className="ml1" />
                </Button>
              </Link>
            </div>
            <Link
              className="mt2 text-underline text-underline-hover"
              to="https://nft.footprint.network"
              target="_blank"
            >
              See what you can build with NFT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataApiNFT;
