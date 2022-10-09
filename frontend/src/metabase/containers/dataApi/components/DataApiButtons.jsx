import React from "react";
import Link from "metabase/components/Link";
import Button from "metabase/components/Button";

const DataApiButtons = () => {
  return (
    <div className="data-api__buttons">
      <Link to="mailto:sales@footprint.network" target="_blank">
        <Button className="data-api__button-bland">Try for FREE</Button>
      </Link>
      <Link to="https://fp-api.readme.io/reference/welcome" target="_blank">
        <Button className="data-api__button-white">View Docs</Button>
      </Link>
    </div>
  );
};

export default DataApiButtons;
