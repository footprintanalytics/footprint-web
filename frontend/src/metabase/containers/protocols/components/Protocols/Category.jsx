/* eslint-disable react/prop-types */
import Link from "metabase/components/Link";
import React from "react";
import { getDashboardQueryLink } from "../../shared/utils";
import { trackStructEvent } from "metabase/lib/analytics";
import { allShowText } from "metabase/containers/protocols/shared/config";
import Other from "metabase/containers/protocols/components/Protocols/Other";

const Category = ({ categorys, router, name }) => {
  const queryKey = `${name.toLowerCase()}`;
  const category = router.location.query[queryKey] || "";

  const getUrl = item => {
    const routeParams = { ...router.location.query, current: 1 };
    routeParams[queryKey] = item;
    return getDashboardQueryLink(routeParams);
  };

  return (
    <div className="protocols__category-container">
      <ul className="protocols__category">
        {categorys &&
          categorys.slice(0, 10).map(item => (
            <li
              key={item}
              onClick={() => trackStructEvent("Protocols Category", item)}
            >
              <Link
                to={getUrl(item)}
                className={`protocols__category-item ${
                  item === category ? "protocols__category-item--active" : ""
                }`}
              >
                {item || allShowText[name]}
              </Link>
            </li>
          ))}
        {categorys && categorys.length > 10 && (
          <Other router={router} name={name} categorys={categorys.slice(10)} />
        )}
      </ul>
    </div>
  );
};

export default Category;
