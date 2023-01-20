/* eslint-disable react/prop-types */
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/core/components/Link";
import Icon from "./Icon";

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
  const hasPrev = history.length > 2 || history.state?.key;
  if (backUrl) {
    return <IconBackLink onClick={() => router.replace(backUrl)} />;
  }

  if (hasPrev) {
    return <IconBackLink onClick={() => router.goBack()} />;
  }

  return <IconBackLink url={url} />;
};
