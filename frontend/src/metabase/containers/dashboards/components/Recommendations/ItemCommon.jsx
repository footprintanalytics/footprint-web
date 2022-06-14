/* eslint-disable react/prop-types */
import Link from "metabase/components/Link";
import React from "react";
import Thumb from "metabase/components/Thumb";
import { formatTitle } from "metabase/lib/formatting";
import { trackStructEvent } from "metabase/lib/analytics";

const ItemCommon = ({ url, thumb, name, target }) => {
  return (
    <Link
      to={url}
      target={target}
      onClick={() => trackStructEvent(`ItemCommon click link ${name}`)}
    >
      {thumb ? (
        <div className="dashboards__recommendations-thumb">
          <Thumb src={thumb} name={name} />
        </div>
      ) : null}
      {name ? (
        <h3 className="dashboards__recommendations-title">
          {formatTitle(name)}
        </h3>
      ) : null}
    </Link>
  );
};

export default ItemCommon;
