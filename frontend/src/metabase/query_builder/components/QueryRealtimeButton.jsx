/* eslint-disable react/prop-types */
import React, { memo, useState } from "react";
import cx from "classnames";
import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import { useOnUnmount } from "metabase/hooks/use-on-unmount";
import "./QueryRealtimeButton.css";

const QueryRealtimeButton = ({
   refreshCardData,
   dashcard
}) => {
  const TICK_PERIOD = 1000;
  const REFRESH_PERIOD = 3 * 60 * 1000;
  const DONE_AFTER_RESTART_TIME = 10 * 1000;
  const [isRealTimeLoading, setRealTimeLoading] = useState(null);
  const [status, setStatus] = useState(null);
  const [isRealTimeMode, setRealTimeMode] = useState(null);
  const [intervalObject, setIntervalObject] = useState(null);
  let _refreshElapsed;
  const _clearRefreshInterval = () => {
    if (intervalObject !== null) {
      clearInterval(intervalObject);
      setIntervalObject(null);
    }
  }

  const setRefreshPeriod = () => {
    _clearRefreshInterval();
    if (intervalObject === null) {
      setIntervalObject(setInterval(
        _tickRefreshClock,
        TICK_PERIOD,
      ));
    }
  };

  const _tickRefreshClock = async () => {
    _refreshElapsed = (_refreshElapsed || 0) + TICK_PERIOD;
    if (_refreshElapsed >= REFRESH_PERIOD) {
      _refreshElapsed = 0;
      _refreshCardData();
    }
  }

  const _refreshCardData = async () => {
    _clearRefreshInterval()
    setRealTimeLoading(true);
    await refreshCardData({ dashcard, card: dashcard.card });
    setRealTimeLoading(false);
    setStatus("Refresh done");
    setTimeout(() => {
      setStatus(null);
      if (isRealTimeMode) {
        setRefreshPeriod();
      }
    }, DONE_AFTER_RESTART_TIME)
  }

  useOnUnmount(() => {
    _clearRefreshInterval();
    setRealTimeLoading(false)
    setStatus(null)
    setRealTimeMode(false)
  })

  return (
    <Tooltip
      key="realtimeMode"
      tooltip={isRealTimeMode ? "Close realtime mode" : "Open realtime mode"}
    >
      <div
        className={cx(
        "cursor-pointer",
          isRealTimeMode ? "dash-card__button-realtime" : "dash-card__button-normal")
        }
        onClick={() => {
          setRealTimeMode(!isRealTimeMode);
          if (isRealTimeMode || intervalObject) {
            _clearRefreshInterval();
            setRealTimeLoading(false)
            setStatus(null)
          } else {
            _refreshCardData();
            setRefreshPeriod();
          }
        }
      }>
        {status && <span style={{ color: "#666c80" }}>{status}</span>}
        <Icon
          className={cx("ml1", isRealTimeLoading ? "loading-cache" : "")}
          name="refresh"
          size={14}
          color={isRealTimeMode ? "#666c80" : "#9AA0AF"}
        />
      </div>
    </Tooltip>
  );
}

export default memo(QueryRealtimeButton);
