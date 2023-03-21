import { Skeleton } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import "./index.css";
import List from "./List";

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const data = [
    { type: "Twitter", enable: true, icon: "", desc: "" },
    { type: "Discord", enable: true, icon: "", desc: "" },
    { type: "Notification", enable: true, icon: "", desc: "" },
    { type: "Airdrop", enable: false, icon: "", desc: "" },
    { type: "Quest", enable: false, icon: "", desc: "" },
  ];
  // const { isLoading, data } = useQuery(
  //   "fetchHomeNewRecommend",
  //   fetchHomeNewRecommend,
  //   QUERY_OPTIONS,
  // );

  return (
    <div className="campaign__list">
      <div className="dashboards__layout">
        {isLoading ? <Skeleton active /> : <List recommends={data} />}
      </div>
    </div>
  );
};

export default Recommendations;
