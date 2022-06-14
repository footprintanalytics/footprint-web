/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/components/Link";

const WrapLink = ({ url, children, className, onClick = () => {} }) => {
  return url.startsWith("https") ? (
    <Link
      href={url}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  ) : (
    <Link to={url} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default WrapLink;
