/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";

const StudioIcon = props => {
  const { height = 14, width = 14, children } = props;
  return (
    <div className="flex justify-center align-center" style={{ height, width }}>
      {children}
    </div>
  );
};


export default StudioIcon;
