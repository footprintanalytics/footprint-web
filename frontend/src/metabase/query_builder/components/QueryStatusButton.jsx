/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import { connect } from "react-redux";
import { fetchCardData } from "metabase/dashboard/actions";
import "./QueryStatusButton.css";
import Icon from "metabase/components/Icon";

const QueryStatusButton = ({
   refreshCardData,
   dashcard,
   data,
   loading,
   setLoading,
}) => {
  const updated_at = data?.updated_at || data?.started_at;
  const [statusText, setStatusText] = React.useState("");
  const tableUpdated = new Date(dashcard.card.tableLastUpdated);
  React.useEffect(() => {
    const timeDiff = getTimeDiff(updated_at);
    setStatusText(timeAgo(updated_at))
    if (tableUpdated > updated_at || timeDiff > 24 * 60 * 60 * 1000) {
      refresh();
    }
  }, [dashcard, refresh, updated_at]);

  function getTimeDiff(timestamp) {
    if (!timestamp) {
      return 0;
    }
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    return Math.abs(currentDate - targetDate);
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
      if (minutes === 0) {
        return `Just now`;
      }
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  }

  const refresh = async () => {
    setLoading(true);
    const result = await refreshCardData({ dashcard, card: dashcard.card, clear: false });
    setLoading(false);
    setStatusText(timeAgo(result.payload.result.started_at));
  }

  return (
    <div className={cx("query-refresh__root flex align-center", {"query-refresh__normal": !loading, "query-refresh__warning": loading})}>
      {!loading && (<div>{statusText}</div>)}
      {loading && (<div>Running...</div>)}
      {!!data && !loading && status === "normal" && (<Icon className="ml1" name={"query_finish"} color="#52c41a" size={10} />)}
    </div>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  fetchCardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryStatusButton);
