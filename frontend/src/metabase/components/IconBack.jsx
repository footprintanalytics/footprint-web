/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import Icon from "./Icon";
import Link from "./Link";

const IconBackLink = ({ url, onClick }) => {
  return (
    <Link
      className="flex align-center"
      style={{ marginRight: 12, cursor: "pointer" }}
      to={url}
      onClick={e => {
        trackStructEvent("Back");
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Icon name="back2" size={18} />
    </Link>
  );
};

export const IconBack = ({ router, url = "/dashboards" }) => {
  const backUrl = router.location.query.back_url;
  const hasPrev = history.length > 2;

  if (backUrl) {
    return <IconBackLink onClick={() => router.replace(backUrl)} />;
  }

  if (hasPrev) {
    return <IconBackLink onClick={() => router.goBack()} />;
  }

  return <IconBackLink url={url} />;
};
