/* eslint-disable curly */
/* eslint-disable react/prop-types */
import Link from "metabase/components/Link";
import React from "react";
import { getDashboardQueryLink } from "../../shared/utils";
import "./index.css";
import Item from "./Item";

const Tags = ({ router, list, name, link, className = "protocols__tags" }) => {
  const queryKey = `${name.toLowerCase()}`;

  const getLinkProps = item => {
    const routeParams = { ...router.location.query };
    routeParams[queryKey] = item;
    const url = getDashboardQueryLink(routeParams);
    return { to: url };
  };

  return (
    <div className={className}>
      {list.map((item, index) => {
        return link ? (
          <Link key={item + index} {...getLinkProps(item)}>
            <Item router={router} item={item} closable={false} />
          </Link>
        ) : (
          <Item router={router} item={item} closable={false} />
        );
      })}
    </div>
  );
};

export default Tags;
