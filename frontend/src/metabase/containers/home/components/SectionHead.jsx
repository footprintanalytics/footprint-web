/* eslint-disable react/prop-types */

import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";
import Link from "metabase/core/components/Link";
import Icon from "metabase/components/Icon";

const SectionHead = props => {
  const { img, title, link, className } = props;
  return (
    <div
      className={cx("flex align-center justify-between mb2 mt4", link ? "cursor-pointer" : "", className)}
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
    </div>
  );
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(null, mapDispatchToProps)(SectionHead);
