/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { get } from "lodash";
import moment from "moment";

const LineRender = ({ data, type = "line" }) => {
  const rows = data?.rows;
  const cols = data?.cols;
  const xDataIndex = cols?.findIndex(col => col.base_type === "type/Date") || 0;
  const yDataIndex =
    cols?.findIndex(col => col.base_type === "type/BigInteger") || 1;
  // console.log("rowsrows", rows)
  // console.log("firstRow", rows?.map(item => get(item, 0)))
  // console.log("secondRow", rows?.map(item => get(item, 1)))
  rows?.sort();

  const xData = rows?.map(item =>
    moment(get(item, xDataIndex)).format("YYYY-MM-DD"),
  );
  const yData = rows?.map(item => get(item, yDataIndex));
  const ref = React.createRef();
  useEffect(() => {
    const myChart = window.echarts.init(ref.current);
    const option = {
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          showMinLabel: false,
          // fontSize: 10,
          // align: "right",
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      grid: {
        top: "15%",
      },
      series: [
        {
          data: yData,
          type: type,
          smooth: true,
          symbol: "none",
        },
      ],
    };
    option && myChart.setOption(option);
  }, [data, ref, type, xData, yData]);
  return <div ref={ref} style={{ width: "250px", height: "150px" }}></div>;
};

export default LineRender;
