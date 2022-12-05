/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import RunningTimer from "metabase/query_builder/components/view/RunningTimer";

const QuestionRunningTime = props => {
  const { isRunning } = props;
  const [start, setStart] = useState(0);
  const [runningTime, setRunningTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
      setStart(new Date());
      setRunningTime(0);
    } else {
      if (start) {
        setRunningTime(new Date() - start);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const formatTime = time => {
    if (time < 0) {
      return 0;
    }
    return Math.floor(time / 1000.0);
  };

  return (
    <div className="ml2 footprint-secondary-text1">
      {!!runningTime && (
        <div className="flex flex-column" style={{ lineHeight: "normal" }}>
          <span>Last run time: {dayjs(start).format("YYYY-MM-DD HH:mm")}</span>
          <span>Last duration: {formatTime(runningTime)} s</span>
        </div>
      )}
      {isRunning && (
        <span>
          Running: <RunningTimer />
        </span>
      )}
    </div>
  );
};

export default React.memo(QuestionRunningTime);
