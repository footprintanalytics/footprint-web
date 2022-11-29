import React from "react";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { getCreatorQueryLink } from "./getCreatorQueryLink";

export default ({ router, current, pageSize, total }) => ({
  current,
  pageSize,
  showSizeChanger: false,
  total,
  position: ["bottomCenter"],
  onChange: page => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackStructEvent("academy Pagination", page);
  },
  itemRender: (page, type, element) => {
    const link = getCreatorQueryLink({
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
