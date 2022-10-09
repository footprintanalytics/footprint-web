/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/components/Link";
import Button from "metabase/components/Button";

const DataApiButtons = ({ blandButtonText= "Try for free" }) => {
  return (
    <div className="data-api__buttons">
      <Link to="mailto:sales@footprint.network" target="_blank">
        <Button className="data-api__button-bland">{blandButtonText}</Button>
      </Link>
      <Link to="https://fp-api.readme.io/reference/welcome" target="_blank">
        <Button className="data-api__button-white">View Documentation</Button>
      </Link>
    </div>
  );
};

export default DataApiButtons;
