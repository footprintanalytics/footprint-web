/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { debounce, startCase } from "lodash";
import { Button, DatePicker, Drawer, Modal } from "antd";
import { useSize } from "ahooks";
import Detail from "./detail";
import Icon from "metabase/components/Icon";
import dayjs from "dayjs";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";

const { RangePicker } = DatePicker;

const SankeyChart = props => {
  const { projectObject, router, title, canEdit = false, canRefresh = false, isLoading,
    nodes=[],
    links=[],
    onDateRangeChange,
  } = props;

  console.log("SankeyChart nodes", nodes)
  console.log("SankeyChart links", links)

  const projectName = projectObject.protocolSlug
  const ref = React.createRef();
  const [nodeDetail, setNodeDetail] = useState();
  const [chart, setChart] = useState();
  const dateFormat = 'YYYY/MM/DD';

  const [modal, contextHolder] = Modal.useModal();
  const rootRef = React.createRef();
  const rootSize = useSize(rootRef);

  const getNodeName = (id) => {
    return nodes.find(node => node.id === id)?.name || id;
  }

  useEffect(() => {
    const option = {
      title: {
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      color: ["#306FFF"],
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
        lineStyle: {
          color: '#306FFF18',
          curveness: 0.5
        },
        tooltip: {
          show: true,
          formatter: ({ data }) => {
            if (data.name) {
              return `${data.name}<br />Events: ${data.value}`
            } else {
              return `${getNodeName(data.source)} -> ${getNodeName(data.target)}<br />Events: ${data.value}`
            }
          }
        },
        data: nodes,
        links: links,
      }
    };
    let tempChart = chart;
    if (!tempChart) {
      tempChart = window.echarts.init(ref.current);
      setChart(tempChart);
    }
    tempChart.setOption(option);
    console.log("option", option)

    tempChart.on('click', function(params) {
      if (params.componentType === 'series' && params.seriesType === 'sankey' && params.dataType === 'node') {
        onclickDebounce(params.data)
      }
    });
  }, [onclickDebounce, ref, chart, nodes, links])

  useEffect(() => {
    if (rootSize) {
      chartResizeDebounce();
    }
  }, [chartResizeDebounce, rootSize]);

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
              defaultValue={[dayjs().add(-32, 'd'), dayjs()]}
              style={{ borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E", padding: "4px 10px" }}
              onChange={(dates, dateStrings) => {
                onDateRangeChange?.(dateStrings)
                console.log("dateStrings", dateStrings)
              }}
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
        <Detail nodeDetail={nodeDetail}/>
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
