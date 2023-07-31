/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Drawer, DatePicker, Button, Select, Modal, Form, Input } from "antd";
import Detail from "./detail";
import Icon from "metabase/components/Icon";
import dayjs from "dayjs";
import "../index.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const Edit = props => {
  const ref = React.createRef();
  const [nodeDetail, setNodeDetail] = useState();
  const dateFormat = 'YYYY/MM/DD';

  const [modal, contextHolder] = Modal.useModal();

  const customFormat = (value) => `Date: ${value.format(dateFormat)}`;
  useEffect(() => {
    const option = {
      title: {
        text: 'Sankey Diagram'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: {
        type: 'sankey',
        layout: 'none',
        nodeWidth: 80,
        nodeGap: 30,
        draggable: false,
        emphasis: {
          focus: 'adjacency'
        },
        label: {
          show: true,
          position: "top",
          formatter: params => {
            return params.name
          }
        },
        data: [
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
        links: [
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
        ]
      }
    };
    const chart = window.echarts.init(ref.current);
    console.log("window.echarts", window.echarts)
    console.log("ref.current", ref.current)
    console.log("chart", chart)
    chart.setOption(option);

    chart.on('click', function(params) {
      if (params.componentType === 'series' && params.seriesType === 'sankey' && params.dataType === 'node') {
        onclick(params.data)
      }
    });
  }, [ref])

  const onclick = debounce(data => {
    setNodeDetail(data);
    console.log("vvvvvv", data)
  }, 300);

  const renderConditions = () => {
    return (
      <div className="journey-edit__condition">
        <h3>Analysis Conditions</h3>
        <div>
          Select Events
          <Select
            defaultValue="lucy"
            style={{
              width: 120,
            }}
            onChange={() => {}}
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'Yiminghe',
                label: 'yiminghe',
              },
            ]}
          />
        </div>
        <div className="flex flex-column">
          <span>Set</span>
          <div className="flex">
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              onChange={() => {}}
              options={[
                {
                  value: 'Game Start',
                  label: 'game-start',
                },
                {
                  value: 'Pay for',
                  label: 'pay-for',
                },
              ]}
            />
            <span>as</span>
            <Select
              defaultValue="first-event"
              style={{
                width: 120,
              }}
              onChange={() => {}}
              options={[
                {
                  value: 'First Event',
                  label: 'first-event',
                },
                {
                  value: 'Last Event',
                  label: 'last-event',
                },
              ]}
            />
          </div>
          <div className="flex flex-column">
            <span>Maximum Session Interval</span>
            <div className="flex">
              <Select
                defaultValue="30"
                style={{
                  width: 120,
                }}
                onChange={() => {}}
                options={[
                  {
                    value: '30',
                    label: '30',
                  },
                  {
                    value: '60',
                    label: '60',
                  },
                ]}
              />
              <Select
                defaultValue="first-event"
                style={{
                  width: 120,
                }}
                onChange={() => {}}
                options={[
                  {
                    value: 'Minute',
                    label: 'minute',
                  },
                  {
                    value: 'Hour',
                    label: 'hour',
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <h3>User Filter</h3>
            <Icon name="add" />
          </div>
          <div className="flex">
            <Button onClick={() => confirm()}>Save</Button>
            <Button>Calculate</Button>
          </div>
        </div>
      </div>
    )
  }
  const confirm = () => {
    const content = (
      <div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </div>
    )
    modal.confirm({
      title: 'Save',
      content: content,
      okText: 'Save',
      cancelText: 'Cancel',
    });
  };
  return (
    <div className="journey-edit">
      <div className="flex justify-between full-width">
        <h2>Journey</h2>
        <Button>Saved Journey</Button>
      </div>
      <div className="journey-edit__main">
        {renderConditions()}
        <div className="journey__vertical-line"/>
        <div className="journey-edit__chart">
          <div className="flex justify-between p2">
            <div className="flex">
              <span>Name 1</span>
              <Icon className="ml1" name="edit_document" />
            </div>
            <div className="flex">
              <Icon name="refresh" />
              <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={customFormat} />
            </div>
          </div>
          <div className="journey__split-line" />
          <div ref={ref} style={{ width: "100%", height: 600, }}/>
        </div>


      </div>
      <Drawer
        title="View Users"
        placement="right"
        width={780}
        onClose={() => setNodeDetail(null)}
        open={!!nodeDetail}
      >
        <Detail data={nodeDetail} />
      </Drawer>
      {contextHolder}
    </div>
  );
};


export default Edit;
