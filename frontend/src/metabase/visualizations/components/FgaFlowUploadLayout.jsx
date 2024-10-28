/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Avatar, Button, Modal, Result, Radio, message, Timeline, Steps, theme, Table } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const FgaFlowUploadLayout = ({onSuccess}) => {
  const [timeItems, setTimeItems] = useState([{ label: 'Step 1: Test connection done', completed: true }, { label: 'Step 2: Sync sample data done', completed: true }, { label: 'Step 3: ETL sample data done', completed: true }]);
  const { token } = theme.useToken();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  const data = [
    {
      key: '1',
      user_id: 1,
      name: 'xxx',
      age: 12,
    },
  ];
  const steps = [
    {
      title: 'Upload Data',
      content: (<div className="flex flex-col justify-center" style={{ padding: 20, width: 200, margin: "auto"}}>
        <Button>Upload CSV</Button>
        <Button>Connect Mysql</Button>
        <Button>Connect Postgres</Button>
      </div>),
    },
    {
      title: 'Data Processing',
      content: (
        <div className="flex p-20" style={{padding: 20}}>
        <Timeline>
          {timeItems.map((item, index) => (
            <Timeline.Item
              key={index}
              dot={item.completed ? <CheckCircleOutlined style={{ color: 'green' }} /> : <div />}
            >
              {item.label}
            </Timeline.Item>
          ))}
        </Timeline>
        </div>
      ),
    },
    {
      title: 'Preview Data',
      content: (<div><Table columns={columns} dataSource={data} pagination={false} /></div>),
    },
    {
      title: 'Produce Data',
      content: (<div className="flex justify-center line-height-2" style={{padding: 40, lineHeight: 1.5}}>Waiting for 5 minutes<br/>The data production was successful, and the associated chart has been unlocked.</div>),
    },
  ];
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  const getTimeItemsFromCount = (count) => {
    if (count === 0) {
      return [{ label: 'Step 1: Ready for connection done', completed: true }]
    }
    if (count === 1) {
      return [{ label: 'Step 1: Test connection done', completed: true }, { label: 'Step 2: Sync sample data done', completed: true }]
    }
    if (count >= 2) {
      return [{ label: 'Step 1: Test connection done', completed: true }, { label: 'Step 2: Sync sample data done', completed: true }, { label: 'Step 3: ETL sample data done', completed: true }]
    }
  }
/*  useEffect(() => {
    if (count >= 4) return;

    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [count]);*/


  return (
    <div className="flex flex-col">
      {/*<Button>Upload CSV</Button>*/}
     {/* <Timeline>
        {timeItems?.map((item, index) => (
          <Timeline.Item
            key={index}
            dot={item.completed ? <CheckCircleOutlined style={{ color: 'green' }} /> : <div />}
          >
            {item.label}
          </Timeline.Item>
        ))}
      </Timeline>*/}

      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div className="flex justify-end" style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => onSuccess?.()}>
            Done
          </Button>
        )}
        {/*{current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}*/}
      </div>
    </div>
  );
};

export default FgaFlowUploadLayout;
