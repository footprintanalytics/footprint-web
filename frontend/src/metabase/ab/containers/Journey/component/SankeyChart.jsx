/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Button, DatePicker, Drawer, Form, Input, Modal, Select, Skeleton } from "antd";
const { RangePicker } = DatePicker;
import { useSize } from 'ahooks';
import Detail from "./detail";
import Icon from "metabase/components/Icon";
import dayjs from "dayjs";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";

const SankeyChart = props => {
  const { projectObject, router, title, canEdit = false, canRefresh = false, isLoading,
    data=[
      {
        name: 'a',
        value: 100
      },
      {
        name: 'b',
        value: 200
      },
      {
        name: 'c',
        value: 30
      },
      {
        name: 'd',
        value: 30
      }
    ],
    links=[
      {
        source: 'a',
        target: 'b',
        value: 5
      },
      {
        source: 'a',
        target: 'c',
        value: 9
      },
      {
        source: 'b',
        target: 'd',
        value: 20
      },
      {
        source: 'c',
        target: 'd',
        value: 20
      },
      {
        source: 'a',
        target: 'd',
        value: 5
      }
    ],

  } = props;
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
      title: {
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      color: ["#6588E3"],
      animation: false,
      series: {
        type: 'sankey',
        layout: 'none',
        nodeWidth: 80,
        nodeGap: 30,
        nodeAlign: 'left',
        draggable: false,
        emphasis: {
          focus: 'adjacency'
        },
        label: {
          show: true,
          position: "top",
          formatter: params => {
            return params.name
          },
          color: "white",
        },
        tooltip: {
          show: true,
          formatter: ({ data }) => {
            if (data.name) {
              return `${data.name}<br />Sessions: ${data.value}`
            } else {
              return `${data.source} -> ${data.target}<br />Sessions: ${data.value}`
            }

          }
        },
        data: data,
        links: links,
      }
    };
    let tempChart = chart;
    if (!tempChart) {
      tempChart = window.echarts.init(ref.current);
      setChart(tempChart);
    }
    tempChart.setOption(option);

    tempChart.on('click', function(params) {
      if (params.componentType === 'series' && params.seriesType === 'sankey' && params.dataType === 'node') {
        onclickDebounce(params.data)
      }
    });
  }, [onclickDebounce, ref, chart, data, links])

  useEffect(() => {
    if (rootSize) {
      chartResizeDebounce();
    }
    console.log("rootSize", rootSize)
  }, [chartResizeDebounce, rootSize]);
  useEffect(() => {
    if (isLoading) {
      chart?.clear()
    }
  }, [isLoading]);

  const chartResizeDebounce = debounce(data => {
    chart?.resize();
  }, 300);

  const onclickDebounce = debounce(data => {
    setNodeDetail(data);
  }, 300);



  return (
    <>
      <div className="journey-edit__chart" ref={rootRef}>
        <div className="flex justify-between p2">
          <div className="flex align-center">
            <span>{title}</span>
            {canEdit && (<Icon className="ml1" name="edit_document" />)}
          </div>
          <div className="flex align-center">
            {canRefresh && (
              <Button className="mx1 flex align-center">
                <Icon name="refresh" size={14}/>
              </Button>
            )}
            <RangePicker
              defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
            />
          </div>
        </div>
        <div className="journey__split-line" />
        <div ref={ref} style={{ width: rootSize?.width, height: rootSize?.height - 80, }}/>
      </div>


      <Drawer
        className="journey-detail__drawer"
        style={{ background: "#1B1B1E" }}
        title="View Users"
        placement="right"
        width={780}
        getContainer={() => rootRef.current}
        onClose={() => setNodeDetail(null)}
        open={!!nodeDetail}
      >
        <Detail data={nodeDetail} />
      </Drawer>
      {contextHolder}
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
)(SankeyChart);
