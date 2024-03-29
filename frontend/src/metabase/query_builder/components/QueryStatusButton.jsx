/* eslint-disable react/prop-types */
/* eslint-disable import/order */
import React from "react";
import cx from "classnames";
import { connect } from "react-redux";
import { fetchCardData } from "metabase/dashboard/actions";
import "./QueryStatusButton.css";
import Icon from "metabase/components/Icon";
import { isABPath } from "metabase/ab/utils/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover, Spin } from "antd";
import dayjs from "dayjs";
const utc = require('dayjs/plugin/utc'); // 引入 UTC 插件
dayjs.extend(utc);

const QueryStatusButton = ({
   refreshCardData,
   dashcard,
   data,
   loading,
   setLoading,
   user,
   chartUpdatedAt,
   tableLastUpdateInfo,
}) => {
  const prevLoading = React.useRef(loading);
  const updated_at = data?.updated_at || data?.started_at;
  const cached = data?.cached;
  const [statusText, setStatusText] = React.useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableUpdated = new Date(dashcard.card.tableLastUpdated);
  const isInner = user?.groups?.includes("Inner");
  // 时间戳 chartUpdatedAt utc+8的值，需要转成utc，并且格式为"YYYY-MM-DD HH:mm"
  const dateStr = chartUpdatedAt ? dayjs.utc(new Date(chartUpdatedAt)).format("YYYY-MM-DD HH:mm") : "";

  /*React.useEffect(() => {
    const timeDiff = getTimeDiff(updated_at);
    // setStatusText(timeAgo(updated_at))
    if (isInner && cached && tableUpdated > updated_at || timeDiff > 24 * 60 * 60 * 1000) {
      refresh();
    }
  }, [cached, dashcard, isInner, tableUpdated, updated_at]);*/

  React.useEffect(() => {
    if (statusText) {
      setTimeout(() => {
        setStatusText("");
      }, 1000);
    }
  }, [statusText]);

  React.useEffect(() => {
    if (prevLoading.current && !loading) {
      setStatusText("Done");
    }
    prevLoading.current = loading;
  }, [loading]);

  function getTimeDiff(timestamp) {
    if (!timestamp) {
      return 0;
    }
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    return Math.abs(currentDate - targetDate);
  }

 /* function timeAgo(timestamp) {
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
  }*/

  const refresh = async () => {
    setLoading(true);
    await refreshCardData({ dashcard, card: dashcard.card, clear: false });
    setLoading(false);
    // setStatusText(timeAgo(result.payload.result.started_at));
  }

  return (
    <div className={cx("query-refresh__root flex align-center")}>
      {/*{!loading && (<div style={{ fontSize: 12 }}>{statusText}</div>)}*/}
      {
        isABPath() ? (
          !loading && (
            <Popover
              content={(
                <div className="flex flex-column">
                  {/*<div className="flex flex-column">
                    <div className="text-bold flex align-center"><Icon className="mr1" name="table2" size={14}/>Table (Last data pull time):</div>
                    {
                      tableLastUpdateInfo?.tables?.map((table, index) => {
                        return (
                          <div key={index}>
                            {table.tableName}: {table.tableUpdated ? dayjs.utc(new Date(table.tableUpdated)).format("YYYY-MM-DD HH:mm UTC") : "N/A"}
                          </div>
                        )
                      })
                    }
                  </div>
                  <br/>*/}
                  <div className="flex flex-column">
                    <div className="text-bold flex align-center"><Icon className="mr1" name="search_chart" size={14}/>Chart (Last data update time):</div>
                    <div>{`${dateStr} UTC`}</div>
                  </div>
                </div>
              )}
              title="Chart Info"
            >
              <Icon name="time_status_right" size={12} color="green"/>
            </Popover>
          )
        ) : (
          !loading && statusText && <Icon name="time_status_right" size={12} color="green"/>
        )
      }
      {/*{!loading && statusText && <Icon name="time_status_right" size={12} color="green"/>}*/}
      {loading && (<Spin indicator={<LoadingOutlined style={{ fontSize: 12, background: "transparent", color: "green" }} spin />}/>)}
      {/*{!!data && !loading && status === "normal" && (<Icon className="ml1" name={"query_finish"} color="#52c41a" size={10} />)}*/}
    </div>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  fetchCardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryStatusButton);
