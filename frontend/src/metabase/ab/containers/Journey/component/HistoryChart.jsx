/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { DatePicker, Modal } from "antd";
import { useSize } from "ahooks";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";

const { RangePicker } = DatePicker;

const HistoryChart = props => {
  const { projectObject, router, title, canEdit = false, canRefresh = false, } = props;
  const projectName = projectObject.protocolSlug
  const ref = React.createRef();
  const [nodeDetail, setNodeDetail] = useState();
  const [chart, setChart] = useState();
  const dateFormat = 'YYYY/MM/DD';

  const [modal, contextHolder] = Modal.useModal();
  const rootRef = React.createRef();
  const rootSize = useSize(rootRef);

  const customFormat = (value) => `${value.format(dateFormat)}`;
  useEffect(() => {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: "dotted",
            color: "#ffffff10",
          }
        },
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          symbol: 'circle',
          symbolSize: 3,
          sampling: 'average',
          itemStyle: {
            color: '#44F'
          },
          areaStyle: {
            color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(68, 68, 255, 0.20)'
              },
              {
                offset: 1,
                color: 'rgba(68, 68, 255, 0.00)'
              }
            ])
          }
        }
      ]
    };
    const chart = window.echarts.init(ref.current);
    console.log("window.echarts", window.echarts)
    console.log("ref.current", ref.current)
    console.log("chart", chart)
    chart.setOption(option);

    setChart(chart);
  }, [ref])

  return (
    <>
      <div className="journey-detail__history" >
        <div ref={ref} style={{ width: 740, height: 300 }}/>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(HistoryChart);
