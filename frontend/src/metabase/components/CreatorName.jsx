/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/core/components/Link";
import { isDefi360 } from "metabase/lib/project_info";
import { color } from "metabase/lib/colors";

function CreatorName({ creatorName }) {
  if (isDefi360()) {
    return <div>{`${creatorName}`}</div>;
  }
  return (
    <Link
      className="text-underline text-underline-hover"
      to={`/@${creatorName}`}
      // target="_blank"
      onClick={e => e.stopPropagation()}
      style={{
        color: color("brand"),
        textDecorationColor: color("brand"),
      }}
    >
      {`${creatorName}`}
    </Link>
  );
}

export default CreatorName;
