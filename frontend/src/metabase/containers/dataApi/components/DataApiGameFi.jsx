/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/components/Link";

const DataApiGameFi = () => {
  return (
    <div className="data-api__get-start data-api__get-start-gamefi-bg">
      <div className="data-api__box">
        <div className="data-api__get-start-box-container">
          <div className="data-api__get-start-box-main">
            <h3>
              One call to retrieve <br />
              <span className="data-api__text-bland">GameFi data</span>
            </h3>
            <span className="data-api__get-start-desc">
              All-in-one API allows access to all <br />
              blockchain data from GameFi industry <br />
              to single game
            </span>
            <Link
              to="https://fp-api.readme.io/reference/get_protocol-protocol-slug-contract"
              target="_blank"
            >
              <Button className="data-api__button-bland">
                {"Learn more >>>"}
              </Button>
            </Link>
          </div>
          <img src={getOssUrl("img_da_bg_2022100863.png")} alt="gamefi" />
        </div>
      </div>
    </div>
  );
};

export default DataApiGameFi;
