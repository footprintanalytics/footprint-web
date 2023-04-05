/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/core/components/Link";

function CreatorName({ creatorName }) {
  return (
    <Link
      className="create-name-link text-underline text-underline-hover"
      to={`/@${creatorName}`}
      // target="_blank"
      onClick={e => e.stopPropagation()}
    >
      {`${creatorName}`}
    </Link>
  );
}

export default CreatorName;
