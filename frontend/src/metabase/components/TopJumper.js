import React, { useEffect, useState } from "react";
import "./TopJumper.css";
import _ from "underscore";
import cx from "classnames";
import Icon from "metabase/components/Icon";

// eslint-disable-next-line react/prop-types
const TopJumper = ({ className }) => {
  const [show, switchShow] = useState(false);

  useEffect(() => {
    const listener = _.throttle(() => {
      switchShow(window.scrollY > 500);
    }, 500);
    document.addEventListener("scroll", listener);
    return () => document.removeEventListener("scroll", listener);
  }, [show]);

  return show ? (
    <div
      className={cx("top-jumper", className)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Icon name="to_top" size={16} />
    </div>
  ) : null;
};

export default TopJumper;
