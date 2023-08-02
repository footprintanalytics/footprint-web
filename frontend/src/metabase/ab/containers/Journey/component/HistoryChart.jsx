/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { DatePicker, Modal } from "antd";
import { useSize } from "ahooks";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";

const { RangePicker } = DatePicker;

const HistoryChart = props => {
  const { projectObject, isLoading, router, title, canEdit = false, canRefresh = false, data, } = props;
  const [chart, setChart] = useState();
  const projectName = projectObject.protocolSlug
  const ref = React.createRef();
  const [nodeDetail, setNodeDetail] = useState();
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
        data: data?.map(item => item.event_date)
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
          data: data?.map(item => item.value),
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
    let tempChart = chart;
    if (!tempChart) {
      tempChart = window.echarts.init(ref.current);
      setChart(tempChart);
    }
    tempChart.setOption(option);

    setChart(tempChart);
  }, [ref])

  useEffect(() => {
    if (isLoading) {
      chart?.showLoading({
        text: 'Loading...',
        maskColor: '#1B1B1E',
        textColor: '#fff',
        fontSize: 16,
      });
    } else {
      chart?.hideLoading();
    }
  }, [chart, isLoading]);

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
