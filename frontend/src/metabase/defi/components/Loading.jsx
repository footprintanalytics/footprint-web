import React from "react";
import LoadingSpinner from "metabase/components/LoadingSpinner";

const Loading = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
      <LoadingSpinner message="GETTING INSIGHTS..." />
    </div>
  );
};

export default Loading;
