/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useInterval } from "ahooks";
import dayjs from "dayjs";

const RunningTimer = ({ delay = 1000 }) => {
  const [count, setCount] = useState(0);
  useInterval(() => setCount(count + 1000), delay);

  return <span>{dayjs(count).format("mm:ss")}</span>;
};

export default React.memo(RunningTimer);
