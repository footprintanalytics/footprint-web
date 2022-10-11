/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useInterval } from "ahooks";
import moment from "moment";

const RunningTimer = ({ delay = 1000 }) => {
  const [count, setCount] = useState(0);
  useInterval(() => setCount(count + 1000), delay);
  const duration = moment.duration(count);
  const minutes = duration
    .minutes()
    .toString()
    .padStart(2, "0");
  const seconds = duration
    .seconds()
    .toString()
    .padStart(2, "0");
  return <span>{`${minutes}:${seconds}`}</span>;
};

export default React.memo(RunningTimer);
