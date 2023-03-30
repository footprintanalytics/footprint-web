/* eslint-disable react/prop-types */
import React from "react";
import Button from "metabase/core/components/Button";
import WrapLink from "metabase/containers/about/components/WrapLink";

const AboutButton = ({ className, buttonText, link }) => {
  return (
    <WrapLink className={className} {...(link ? {url: link} : {}) }>
      <Button className="About__btn">
        {buttonText}
      </Button>
    </WrapLink>
  );
};


export default AboutButton;
