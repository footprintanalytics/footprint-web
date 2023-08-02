/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Drawer, DatePicker, Button, Select, Modal, Form, Input, Cascader } from "antd";
import Detail from "./detail";
import Icon from "metabase/components/Icon";
import dayjs from "dayjs";
import "../index.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Head from "metabase/ab/containers/Journey/component/Head";
import SankeyChart from "metabase/ab/containers/Journey/component/SankeyChart";
import UserFilter from "metabase/ab/containers/Journey/component/UserFilter";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";
import { journeyPathAnalyze } from "metabase/new-service";

const Edit = props => {
  const { router, projectObject } = props;
  const projectName = projectObject?.protocolSlug;
  const ref = React.createRef();
  const [nodeDetail, setNodeDetail] = useState();
  const [isLoading, setLoading] = useState();
  const [chartData, setChartData] = useState([{data: null, links: null}]);
  const [params, setParams] = useState({
    "eventIds": ["login","session"],
    "initialEventId": "login",
    "project": "benji",
    "startTime": dayjs().add(-7, 'd').format("YYYY-MM-DD"),
    "endTime": dayjs().format("YYYY-MM-DD"),
    "levelLimit": 6,
  });

  const [modal, contextHolder] = Modal.useModal();

  const renderConditions = () => {
    const options = [
          {
            label: 'login',
            value: 'login',
          },
          {
            label: 'session',
            value: 'session',
          },
          {
            label: 'open',
            value: 'open',
          },
          {
            label: 'purchase',
            value: 'purchase',
          },
          {
            label: 'close',
            value: 'close',
          },
          {
            label: 'reward',
            value: 'reward',
          },
    ];
    const onChange = (value) => {
      setParams({
        ...params,
        eventIds: value,
      })
    };

    const calAction = async () => {
      setLoading(true);
      const result = await journeyPathAnalyze(params);
      setChartData({
        data: result?.nodes,
        links: result?.links,
      })
      setLoading(false);
    }

    return (
      <div className="journey-edit__condition">
        <div className="p2">
          <h3>Analysis Conditions</h3>
        </div>
        <div className="flex flex-column p2" style={{ gap: 10 }}>
          Select Events
          <Select
            style={{
              width: '100%',
            }}
            defaultValue={["login","session"]}
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
              style={{
                width: 120,
              }}
              onChange={(value) => {
                setParams({
                  ...params,
                  initialEventId: value,
                })
              }}
              options={[
                {
                  label: 'login',
                  value: 'login',
                },
                {
                  label: 'session',
                  value: 'session',
                },
                {
                  label: 'open',
                  value: 'open',
                },
                {
                  label: 'purchase',
                  value: 'purchase',
                },
                {
                  label: 'close',
                  value: 'close',
                },
                {
                  label: 'reward',
                  value: 'reward',
                },
              ]}
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
          title="Name 1" canEdit data={chartData?.data} links={chartData?.links}
          onDateRangeChange={(strings) => {
            setParams({
              ...params,
              startTime: strings[0],
              endTime: strings[1],
            })
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