/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import "./QueryRealtimeButton.css";
import { connect } from "react-redux";
import { fetchCardData } from "metabase/dashboard/actions";
import "./QueryRefreshButton.css";

const QueryRefreshButton = ({
   refreshCardData,
   dashcard,
   data,
}) => {
  const updated_at = data?.updated_at || data?.started_at;
  const [statusText, setStatusText] = React.useState("");
  const [status, setStatus] = React.useState("normal");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    initStatus(updated_at)
    setStatusText(timeAgo(updated_at))
  }, [dashcard, updated_at]);

  function initStatus(timestamp) {
    if (!timestamp) {
      return ;
    }
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    const timeDiff = Math.abs(currentDate - targetDate);
    if (timeDiff > 24 * 60 * 60 * 1000) {
      setStatus("warning");
    } else {
      setStatus("normal");
    }
  }
  function timeAgo(timestamp) {
    if (!timestamp) {
      return "";
    }
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    const timeDiff = Math.abs(currentDate - targetDate);
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(timeDiff / 3600000);
    const days = Math.floor(timeDiff / 86400000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  }
  console.log("status", status)
  return (
    <div className={cx("query-refresh__root flex", {"query-refresh__normal": status === "normal", "query-refresh__warning": status === "warning"})}>
      <div>{statusText}</div>
      <Tooltip
        key="queryRefresh"
        tooltip={"Query refresh"}
      >
        {!!data && !loading && (
          <div
            className={cx("cursor-pointer", "dash-card__button-normal-always")}
            onClick={async () => {
              setStatusText("Updating...");
              setLoading(true);
              const result = await refreshCardData({ dashcard, card: dashcard.card, clear: false });
              setLoading(false);
              setStatusText(timeAgo(result.payload.result.started_at));
              initStatus(result.payload.result.started_at)
              // refreshCardData({ dashcard, card: dashcard.card, clear: true });
            }
          }>
            <Icon
              className={cx("ml1")}
              name="refresh"
              size={10}
              color={status === "normal" ? "#52c41a" : "#f79009"}
            />
          </div>
        )}
      </Tooltip>
    </div>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  fetchCardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryRefreshButton);
