/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Button from "metabase/core/components/Button";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
import { Image, Skeleton } from "antd";

const DomainDetail = ({
  title,
  desc,
  img,
  bgClassName,
  buttonText,
  buttonLink,
  buttonClassName = "data-api__button-bland",
  direction,
}) => {
  return (
    <div className={`domain-detail ${bgClassName || ""}`}>
      <div className="data-api__box">
        <div
          className="data-api__get-start-box-container"
          style={{ flexDirection: direction || "row" }}
        >
          <div className="data-api__get-start-box-main">
            <h3>{title}</h3>
            {desc?.map(item => {
              return (
                <span className="data-api__get-start-desc" key={item}>
                  {item}
                </span>
              );
            })}

            <div className="mb4" />
            <Link
              to={buttonLink}
              target="_blank"
              style={{ width: "fit-content" }}
            >
              <Button className={buttonClassName}>{buttonText}</Button>
            </Link>
          </div>
          <Image
            placeholder={<Skeleton active />}
            preview={false}
            src={getOssUrl(img)}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainDetail;
