/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import DataApiButtons from "metabase/containers/dataApi/components/DataApiButtons";

const ReadyBuild = () => {
  return (
    <div className="ready-build ready-build__bg">
      <div className="ready-build__container">
        <h3>Ready to get started?</h3>
        <div className="ready-build__desc">
          <span>
            Get access to the most powerful and comprehensive data, or create an
            account today and start building directly. You can also contact our
            product experts to get a personal onboarding and a custom solution
            for your business.
          </span>
        </div>
        <DataApiButtons
          blandButtonText="Start Building for Free"
          secondButtonLink="https://forms.gle/ze3F44681h2wgCHT9"
          secondButtonText="Contact us"
        />
      </div>
    </div>
  );
};

export default ReadyBuild;
