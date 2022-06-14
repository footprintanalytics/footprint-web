/* eslint-disable react/prop-types */
import Link from "metabase/components/Link";
import React from "react";
import { guestUrl } from "metabase/lib/urls";
import { getChannel } from "metabase/selectors/app";
import connect from "react-redux/lib/connect/connect";
import { formatTitle } from "metabase/lib/formatting";

const Item = ({ item, index }) => {
  const url = guestUrl({ ...item, type: "dashboard" });
  return (
    <Link
      key={item.id}
      className="hots__inner-item"
      target="_blank"
      to={url}
      onClick={e => {
        e.preventDefault();
        window.open(url);
      }}
    >
      <div className="hots__item-index">{index + 1}</div>
      <div
        className="hots__item-text footprint-primary-text"
        style={{ WebkitBoxOrient: "vertical" }}
      >
        {formatTitle(item.name)}
      </div>
    </Link>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    channel: getChannel(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Item);
