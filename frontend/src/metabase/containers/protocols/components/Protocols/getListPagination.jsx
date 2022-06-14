import Link from "metabase/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import { getDashboardQueryLink } from "../../shared/utils";

export default ({ router, current, pageSize, total }) => ({
  current,
  pageSize,
  showSizeChanger: false,
  total,
  position: ["bottomCenter"],
  onChange: page => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackStructEvent("Protocols Pagination", page);
  },
  itemRender: (page, type, element) => {
    const link = getDashboardQueryLink({
      ...router.location.query,
      current: page,
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
