/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";

export const DashboardLazyLoadContainer = ({ className, children }) => {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  const top = ref.current?.getBoundingClientRect().top;

  useEffect(() => {
    if (top) {
      setHeight(top);
    }
  }, [top]);

  return (
    <div
      id="html2canvas-Dashboard"
      ref={ref}
      style={ref.current ? { height: `calc(100vh - ${height}px)` } : {}}
      className={className}
    >
      {children}
    </div>
  );
};
