/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Icon from "metabase/components/Icon";

const QueryRefreshButton = ({
   refreshCardData,
   dashcard,
}) => {

  return (
    <div
      className={cx("cursor-pointer", "dash-card__button-normal")}
      onClick={() => {
        refreshCardData({ dashcard, card: dashcard.card, clear: false })
      }}>
      <Icon
        className={cx("ml1")}
        name="refresh"
        size={10}
        color={status === "normal" ? "#52c41a" : "#f79009"}
      />
    </div>
  );
}
export default QueryRefreshButton;
