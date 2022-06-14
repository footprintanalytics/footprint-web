/* eslint-disable react/prop-types */
import Icon from "metabase/components/Icon";
import React from "react";

const PublicBackButton = ({ router }) => {
  return (
    <span
      className="flex align-center"
      style={{ marginRight: 18, cursor: "pointer" }}
      onClick={() => {
        router.replace("/public/explore");
      }}
    >
      <Icon name="back2" size={18} />
    </span>
  );
};

export default PublicBackButton;
