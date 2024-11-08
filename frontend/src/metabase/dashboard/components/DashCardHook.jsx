/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { getWeb2TypeText, isWeb2DataCreated } from "metabase/ab/utils/mapping-utils";
import { debounce, throttle } from "lodash";
const DashCardHook = props => {
  const { chartTypeStatus, refreshCard, card, chartUpdatedAt } = props;
  useEffect(() => {
    const web2TypeText = getWeb2TypeText(card?.id);
    if (web2TypeText === null) {
      return null;
    }
    const latestUpdateTimeStr = chartTypeStatus?.find(i => i.chartType === web2TypeText)?.latestUpdateTime;
    if (!latestUpdateTimeStr) {
      return null;
    }
    const latestUpdateTime = new Date(latestUpdateTimeStr).getTime() - 8*3600*1000;
    const chartUpdatedTime = chartUpdatedAt ? new Date(chartUpdatedAt).getTime() : null;
    console.log("DashCardHook", latestUpdateTime, chartUpdatedTime)
    if (chartUpdatedTime && latestUpdateTime > chartUpdatedTime) {
      refreshCardThrottle()
    }
  }, [chartTypeStatus]);

  const refreshCardThrottle = throttle((event) => {
    refreshCard()
  }, 10000);

  return (
    <>
    </>
  )
}

export default DashCardHook;
