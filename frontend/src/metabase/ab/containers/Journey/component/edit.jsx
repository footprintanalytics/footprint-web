/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import "../index.css";
import Head from "metabase/ab/containers/Journey/component/Head";
import SankeyChart from "metabase/ab/containers/Journey/component/SankeyChart";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";
import { journeyPathAnalyze } from "metabase/new-service";
import demoData from "metabase/ab/containers/Journey/util/data";

const Edit = props => {
  const { router, projectObject } = props;
  const projectName = projectObject?.protocolSlug;
  const ref = React.createRef();
  const [isLoading, setLoading] = useState();
  const [chartData, setChartData] = useState({nodes: demoData.nodes, links: demoData.links});

  const [params, setParams] = useState({
    "eventNames": ["login","play_games"],
    "initialEventName": "login",
    "project": "benji",
    "startTime": dayjs().add(-32, 'd').format("YYYY-MM-DD"),
    "endTime": dayjs().format("YYYY-MM-DD"),
    "levelLimit": 6,
  });
  const options = [
    {
      label: 'login',
      value: 'login',
    },
    {
      label: 'Play Games',
      value: 'play_games',
    },
    {
      label: 'Purchase',
      value: 'purchase',
    },
    {
      label: 'NFT Reward',
      value: 'nft_reward',
    },
    {
      label: 'Close App',
      value: 'close_app',
    },
    {
      label: 'Open App',
      value: 'open_app',
    },
  ];

  const [modal, contextHolder] = Modal.useModal();

  const calAction = async () => {
    setLoading(true);
    const result = await journeyPathAnalyze(params);
    setChartData({
      nodes: result?.nodes,
      links: result?.links,
    })
    setLoading(false);
  }

  const renderConditions = () => {
    const onChange = (value) => {
      setParams({
        ...params,
        eventNames: value,
      })
    };


    return (
      <div className="journey-edit__condition">
        <div className="p2">
          <h3>Analysis Conditions</h3>
        </div>
        <div className="flex flex-column p2" style={{ gap: 10 }}>
          Select Events
          <Select
            style={{ width: '100%', borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
            dropdownStyle={{
              background: "#1C1C1E",
              color: "white",
              border: "1px solid #ffffff20"
            }}
            defaultValue={["login","play_games"]}
            options={options}
            onChange={onChange}
            mode="multiple"
            optionLabelProp="label"
          />
        </div>
        <div className="flex flex-column p2" style={{ gap: 10 }}>
          <span>Set</span>
          <div className="flex align-center" style={{ gap: 10 }}>
            <Select
              defaultValue="login"
              style={{ width: 120,borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff20"
              }}
              onChange={(value) => {
                setParams({
                  ...params,
                  initialEventName: value,
                })
              }}
              options={options}
            />
            <span>as</span>
            <span className="ml1">First Event</span>
            {/*<Select
              defaultValue="first-event"
              style={{
                width: 120,
              }}
              onChange={() => {}}
              options={[
                {
                  label: 'First Event',
                  value: 'first-event',
                },
                {
                  label: 'Last Event',
                  value: 'last-event',
                },
              ]}
            />*/}
          </div>
        </div>
        {/*<div className="flex flex-column p2" style={{ gap: 10 }}>
          <span>Maximum Session Interval</span>
          <div className="flex" style={{ gap: 10 }}>
            <Select
              defaultValue="30"
              style={{
                width: 60,
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
              defaultValue="minute"
              style={{
                width: 100,
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
          <UserFilter />
        </div>*/}
        <div className="journey-edit__condition-bottom">
          <Button onClick={() => confirm()}>Save</Button>
          <Button type="primary" onClick={() => calAction()}>Calculate</Button>
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
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }}/>
          </Form.Item>
        </Form>
      </div>
    )
    modal.confirm({
      title: 'Save',
      content: content,
      okText: 'Save',
      cancelText: 'Cancel',
      getContainer: ref.current,
      onOk: () => {
        router.replace(`/ab/project/${projectName}/journey`)
      }
    });
  };
  return (
    <div className="journey-edit" ref={ref}>
      <Head title="Journey" isBack buttons={["list"]} router={router} backLink={`/ab/project/${projectName}/journey`}/>
      <div className="journey-edit__main">
        {renderConditions()}
        <SankeyChart
          isLoading={isLoading}
          title="Name 1"
          canEdit
          nodes={chartData?.nodes}
          links={chartData?.links}
          onDateRangeChange={(strings) => {
            setParams({
              ...params,
              startTime: strings[0],
              endTime: strings[1],
            })
          }}
          runData={() => {
            calAction()
          }}
        />
      </div>
      {contextHolder}
    </div>
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
)(Edit);
