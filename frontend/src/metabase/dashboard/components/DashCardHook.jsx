/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { debounce } from "lodash";
import { getWeb2TypeText } from "metabase/ab/utils/mapping-utils";

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
    const latestUpdateTime = new Date(latestUpdateTimeStr).getTime();
    const chartUpdatedTime = chartUpdatedAt ? new Date(chartUpdatedAt).getTime() + 8*3600*1000 : null;
    if (chartUpdatedTime && latestUpdateTime > chartUpdatedTime) {
      refreshCardDebounce()
    }
  }, [chartTypeStatus, chartUpdatedAt]);

  const refreshCardDebounce = debounce(() => {
    refreshCard()
  }, 10000, { leading: true, trailing: false });

  return (
    <>
    </>
  )
}

export default DashCardHook;
