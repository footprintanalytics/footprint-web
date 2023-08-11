/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/core/components/Link";
import {
  getDashboardQueryLink,
  getDashboardQueryTags,
  getSearchDashboardQueryLink,
  isSearch,
} from "../../shared/utils";
import "./index.css";
import Item from "./Item";
// eslint-disable-next-line import/order
import { uniq } from "lodash";

const Tags = ({
  router,
  list = [],
  closable = false,
  link = false,
  searchWords,
}) => {
  const tags = getDashboardQueryTags(router.location.query.tags);
  const getLinkProps = item => {
    const getLink = isSearch()
      ? getSearchDashboardQueryLink
      : getDashboardQueryLink;
    const url = getLink({
      ...router.location.query,
      current: 1,
      tags: uniq([...tags, item]),
      q: item,
    });
    return { to: url };
  };

  return (
    <div>
      {list.map((item, index) =>
        link ? (
          <Link key={item + index} {...getLinkProps(item)}>
            <Item
              router={router}
              item={item}
              closable={false}
              searchWords={searchWords}
            />
          </Link>
        ) : (
          <Item
            key={item + index}
            router={router}
            item={item}
            closable={closable}
            searchWords={searchWords}
          />
        ),
      )}
    </div>
  );
};

export default Tags;
