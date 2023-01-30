/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import "./TaggingModal.css";
import { udTableDetail } from "../new-service";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

const SaveChartToUdTime = ({
  cardId,
  callback
}) => {

  const [showTooLong, setShowTooLong] = useState(false);

  useEffect(() => {
    const startTime = new Date();
    const detailApi = async () => {
      const data = await udTableDetail({ cardId })
      if (data.newestLog.status === "executing") {
        const endTime = new Date();
        if (endTime - startTime > 60000) {
          setShowTooLong(true);
        } else {
          setTimeout(async () => {
            detailApi()
          }, 5000)
        }
      } else {
        callback({ status: data.newestLog.status, tableName: data.chartConfig.targetTableName, successCount: data.chartConfig.successCount })
      }
    }
    const run = () => {
      setTimeout(async () => {
        detailApi();
      }, 5000)
    }
    run();
  }, [callback, cardId])

  const refreshStatus = async () => {
    const data = await udTableDetail({ cardId });
    if (data.newestLog.status !== "executing") {
      callback(data.newestLog.status)
    }
  }
  return (
    <div>
      <div>
        <LoadingSpinner /> Updating the UD table.
      </div>
      {showTooLong && (
        <div className="flex flex-column">
          It looks like the process is a bit long, you can manually click the button to refresh the status.
          <Button onClick={refreshStatus}>refresh status</Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(SaveChartToUdTime);
