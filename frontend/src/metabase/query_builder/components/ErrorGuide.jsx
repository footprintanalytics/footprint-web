import Link from "metabase/components/Link";
import React from "react";

const ErrorGuide = () => {
  return (
    <div className="text-brand text-underline html2canvas-filter">
      <Link
        to="https://docs.footprint.network/guides/charts/sql/upgrade-from-26.05.2022"
        target="_blank"
      >
        (Get help here.)
      </Link>
    </div>
  );
};

export default ErrorGuide;
