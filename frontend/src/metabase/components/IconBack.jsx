/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import Icon from "./Icon";
import Link from "./Link";

export const IconBack = ({ router, url = "/dashboards" }) => {
  return (
    <Link
      className="flex align-center"
      style={{ marginRight: 12, cursor: "pointer" }}
      to={history.length > 2 ? undefined : url}
      onClick={e => {
        trackStructEvent("Back");
        if (history.length > 2) {
          e.preventDefault();
          router.goBack();
        }
      }}
    >
      <Icon name="back2" size={18} />
    </Link>
  );
};
