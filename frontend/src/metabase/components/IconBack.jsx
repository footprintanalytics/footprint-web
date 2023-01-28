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
  if (backUrl) {
    return <IconBackLink onClick={() => router.replace(backUrl)} />;
  }

  const getLocationUrl = (router) => {
    return `${router.location.pathname}${router.location.search}`;
  }

  return <IconBackLink onClick={() => {
    router.goBack();
    const oldLocationUrl = getLocationUrl(router);
    setTimeout(() => {
      const newLocationUrl = getLocationUrl(router);
      if (oldLocationUrl === newLocationUrl) {
        router.replace(url)
      }
    }, 500)
  }} />;
};
