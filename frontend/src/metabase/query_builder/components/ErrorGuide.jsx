/* eslint-disable react/prop-types */
import Link from "metabase/core/components/Link";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";

const ErrorGuide = ({cardId}) => {
  return (
    <div
      className="text-brand text-underline html2canvas-filter"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Link
        to="https://docs.footprint.network/docs/sql-compatible"
        target="_blank"
        onClick={() => trackStructEvent(`error-guide-fix-${cardId}`)}
      >
        How to fix
      </Link>
      <div className="ml2"/>
      <Link
        to="https://discord.gg/3HYaR6USM7"
        target="_blank"
        onClick={() => trackStructEvent(`error-guide-report-${cardId}`)}
      >
        Report to community
      </Link>
    </div>
  );
};

export default ErrorGuide;
