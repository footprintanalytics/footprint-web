/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Button from "metabase/core/components/Button";
import WrapLink from "metabase/containers/about/components/WrapLink";

const AboutButton = ({ className, buttonClassName, buttonText, link, onClick }) => {
  return (
    <WrapLink className={className} {...(link ? {url: link} : {}) } onClick={onClick}>
      <Button className={cx("About__btn", buttonClassName)}>
        {buttonText}
      </Button>
    </WrapLink>
  );
};


export default AboutButton;
