/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/core/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
import { Image, Skeleton } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { CHAIN_COUNT } from "metabase/lib/constants";

const DataApiGetStart = () => {
  return (
    <div className="data-api__get-start data-api__get-start-chain-bg">
      <h1>
        Get started with Footprint{" "}
        <span className="data-api__text-bland">Data API</span>
      </h1>
      <h2>A full suite of APIs for most popular chains and protocols</h2>
      <div className="data-api__box">
        <div className="data-api__get-start-box-container">
          <div className="data-api__get-start-box-main">
            <h3>
              Full access to <br />
              <span className="data-api__text-bland">Chain API</span>
            </h3>
            <span className="data-api__get-start-subtitle">
              {`${CHAIN_COUNT}`} chains support
            </span>
            <span className="data-api__get-start-desc">
              Covering most chains and support from <br />
              raw data to analytic metrics.
            </span>
            <Link
              to="https://docs.footprint.network/reference/get_chain-transactions"
              target="_blank"
            >
              <Button className="data-api__button-bland">
                Learn more <RightOutlined className="ml1" />
              </Button>
            </Link>
          </div>
          <Image
            placeholder={<Skeleton active />}
            preview={false}
            src={getOssUrl("img_da_bg_2022100861.png?2=2")}
          />
        </div>
      </div>
    </div>
  );
};

export default DataApiGetStart;
