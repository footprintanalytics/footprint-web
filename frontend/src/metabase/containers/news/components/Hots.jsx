/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import "./Hots.css";
import Link from "metabase/components/Link";
import Icon from "metabase/components/Icon";
import { getChannel } from "metabase/selectors/app";
import { formatTitle } from "metabase/lib/formatting";
import * as Urls from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";

const getUrl = item => {
  return item.model === "dashboard"
    ? Urls.dashboard(item)
    : Urls.guestUrl({ ...item, type: item.model });
};

const Hots = props => {
  const { list, moreLink, title, icon } = props;
  if (!list || list.length === 0) return null;

  return (
    <div className="hots">
      <div className="hots__top">
        <div className="hots__title footprint-title1">
          <Icon
            className="hots__title-icon"
            name={icon}
            color="#444444"
            size={20}
          />
          {title}
        </div>
        <div style={{ flex: 1 }} />
        {moreLink && (
          <Link
            className="footprint-primary-text"
            href={moreLink}
            target="_blank"
            onClick={() => trackStructEvent("Hot Dashboard", "More")}
          >
            More <Icon name="arrow_right_simple" />
          </Link>
        )}
      </div>
      <div>
        {list.map((item, index) => {
          return (
            <Link
              key={item.publicUuid}
              className="hots__item"
              href={getUrl(item)}
              target="_blank"
              onClick={() => trackStructEvent("Hot Dashboard", item.name)}
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
        })}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    channel: getChannel(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Hots);
