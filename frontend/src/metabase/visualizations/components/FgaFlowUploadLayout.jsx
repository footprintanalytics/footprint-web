/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Avatar, Button, Modal, Result, Radio, message, Timeline, Steps, theme, Table, Spin, Upload } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import FgaFlowDataProcess from "metabase/visualizations/components/FgaFlowDataProcess";
import FgaFlowProduceData from "metabase/visualizations/components/FgaFlowProduceData";
import { fgaEventConfirmCsv } from "metabase/new-service";

const FgaFlowUploadLayout = ({onSuccess, projectObject}) => {
  const [timeItems, setTimeItems] = useState([{ label: 'Step 1: Test connection done', completed: true }, { label: 'Step 2: Sync sample data done', completed: true }, { label: 'Step 3: ETL sample data done', completed: true }]);
  const { token } = theme.useToken();
  const [count, setCount] = useState(0);
  const [confirmCsvLoading, setConfirmCsvLoading] = useState();
  const [csvData, setCSVData] = useState([]);
  const [file, setFile] = useState()
  const [current, setCurrent] = useState(0);
  const projectId = projectObject?.id
  const fileName = file?.name
  const columns = [
    {
      title: 'Project Id',
      dataIndex: 'project_id',
      key: 'project_id',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Event Type',
      dataIndex: 'event_type',
      key: 'name',
    },
    {
      title: 'Sub Event',
      dataIndex: 'sub_event',
      key: 'age',
    },
    {
      title: 'Event Id',
      dataIndex: 'event_id',
      key: 'age2',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'age23',
    },
  ];

  const data = [
    {
      key: '1',
      user_id: 1,
      event_type: 'Account',
      sub_event: 'Login',
      event_id: 1,
      timestamp: 1730113928,
    },
    {
      key: '1',
      user_id: 2,
      event_type: 'Account',
      sub_event: 'Login',
      event_id: 2,
      timestamp: 1730113929,
    },
    {
      key: '1',
      user_id: 3,
      event_type: 'Account',
      sub_event: 'Login',
      event_id: 3,
      timestamp: 1730113923,
    },
    {
      key: '1',
      user_id: 4,
      event_type: 'Account',
      sub_event: 'Login',
      event_id: 4,
      timestamp: 1730113928,
    },
  ];
  const propsUploadAvatarTcOss = {
    name: 'file',
    accept: '.csv',
    showUploadList: false,
    maxCount: 1,
    method: 'post',
    // eslint-disable-next-line no-undef
    action: `/api/v1/fga/event/upload/csv`,
    headers: {
      // token: getUserToken(),
    },
    data: {
      "projectId": projectId + "",
    },
    beforeUpload: async (file) => {
      // const isLt2M = file.size / 1024 / 1024 < 10
      // if (!isLt2M) {
      //   message.error(t('File must smaller than 10MB!'))
      //   return false
      // }
      setFile(file);
      setCurrent(current + 1)
      return false
    },
    onChange(info) {
      const data = info?.file?.response?.data;
      if (data) {
        setCSVData(data)
        message.success("Upload CSV successfully");
        setTimeout(() => {
          setCurrent(current + 1);
        }, 1000);
      }
      console.log('upload onChange: ', info, data)
    },
  }

  const handleConfirmCSV = async () => {
    setConfirmCsvLoading(true)
    await fgaEventConfirmCsv({
      "projectId": projectId + "",
      "fileName": fileName,
    })
    setConfirmCsvLoading(false)
    setCurrent(current + 1)
  }
  const steps = [
    {
      title: 'Upload Data',
      onClick: () => setCurrent(0),
      content: (
        <div className="flex flex-col justify-center" style={{ lineHeight: 1.5, padding: 20, width: 360, margin: "auto"}}>
          <div style={{marginBottom: 20}}>Choose a connector to upload your data:</div>

            <Button className="w-full" >
              <Upload className="w-full" style={{width: "100%"}} name="avatar" {...propsUploadAvatarTcOss}>
                <div style={{width: 300, height: 30}}>CSV</div>
              </Upload>
            </Button>

          <Button onClick={() => {
            message.success("Config Mysql successfully")
            setTimeout(() => {
              setCurrent(current + 1);
            }, 1000);
          }}>Mysql</Button>
          <Button onClick={() => {
            message.success("Config Postgres successfully");
            setTimeout(() => {
              setCurrent(current + 1);
            }, 1000);
          }}>Postgres</Button>
        </div>
      ),
    },
    {
      title: 'Data Processing',
      content: (
        <FgaFlowDataProcess
          projectObject={projectObject}
          previewData={(data) => {
            setCSVData(data)
            setCurrent(current + 1)
          }} file={file}
        />
      ),
      onClick: () => setCurrent(1),
    },
    {
      title: 'Preview Data',
      content: (<div className="flex flex-col" style={{lineHeight: 1.5, padding: 20}}>
        <div>Here is what has been generated based on your data. Please confirm it is correct.</div>
        <Table columns={columns} dataSource={csvData} pagination={false} scroll={{ y: 300 }}/>
        <div className={"flex justify-center "} style={{gap: 10, padding: 20}}>
          <Button onClick={() => setCurrent(0)}>Upload Data Again</Button>
          <Button loading={confirmCsvLoading} type="primary" onClick={() => {
            handleConfirmCSV()
          }}>Start to Produce Data</Button>
        </div>
      </div>),
      onClick: () => setCurrent(2),
    },
    {
      title: 'Produce Data',
      content: (<FgaFlowProduceData onSuccess={() => {
        onSuccess?.()
      }}/>),
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
    height: "100%",
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
    <div className="flex flex-col" style={{width: 840, height: 560}}>
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

      <Steps current={current} items={items} onChange={(index) => setCurrent(index)}/>
      <div style={contentStyle}>{steps[current].content}</div>
      <div className="flex justify-end" style={{ marginTop: 24 }}>
        {/*{current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}*/}
        {/*{current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Butwton>
        )}*/}
        {/*{current === steps.length - 1 && (
          <Button type="primary" onClick={() => onSuccess?.()}>
            View Dashboard
          </Button>
        )}*/}
      </div>
    </div>
  );
};

export default FgaFlowUploadLayout;
