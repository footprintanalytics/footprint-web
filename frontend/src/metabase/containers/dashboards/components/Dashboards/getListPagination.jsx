import Link from "metabase/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import {
  getCreatorQueryLink,
  getDashboardQueryLink,
  getProtocolQueryLink,
  getSearchDashboardQueryLink,
  isCreator,
  isProtocol,
  isSearch,
} from "../../shared/utils";

export default ({ router, current, pageSize, total }) => ({
  current,
  pageSize,
  showSizeChanger: false,
  total,
  position: ["bottomCenter"],
  onChange: page => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackStructEvent("Dashboards Pagination", page);
  },
  itemRender: (page, type, element) => {
    let linkFunc = isProtocol()
      ? getProtocolQueryLink
      : isSearch()
      ? getSearchDashboardQueryLink
      : getDashboardQueryLink;
    if (isCreator()) {
      linkFunc = getCreatorQueryLink;
    }
    const link = linkFunc({
      ...router.location.query,
      current: page,
      location: router.location,
    });
    switch (type) {
      case "page":
        return <Link to={link}>{page}</Link>;
      case "prev":
      case "next":
        return <Link to={link}>{element}</Link>;
      default:
        return element;
    }
  },
});
