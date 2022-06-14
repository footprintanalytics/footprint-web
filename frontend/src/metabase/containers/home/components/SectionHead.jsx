/* eslint-disable react/prop-types */

import React from "react";
import { Flex } from "grid-styled";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Link from "metabase/components/Link";
import cx from "classnames";
import Icon from "metabase/components/Icon";

const SectionHead = props => {
  const { img, title, link, className } = props;
  return (
    <Flex
      mt={20}
      mb={10}
      alignItems="center"
      justifyContent="space-between"
      className={cx(link ? "cursor-pointer" : "", className)}
    >
      <div className="home-section-head footprint-title2">
        <img src={img} alt="Footprint analytics" />
        <span>{title}</span>
      </div>
      {link && (
        <Link
          to={link}
          target={link.startsWith("http") ? "_blank" : ""}
          className="home-section-see footprint-primary-text text-brand-hover"
        >
          See all <Icon name="arrow_right_simple" />
        </Link>
      )}
    </Flex>
  );
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(null, mapDispatchToProps)(SectionHead);
