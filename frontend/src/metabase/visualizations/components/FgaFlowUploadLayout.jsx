/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, message, Steps, Table, theme, Upload } from "antd";
import FgaFlowDataProcess from "metabase/visualizations/components/FgaFlowDataProcess";
import FgaFlowProduceData from "metabase/visualizations/components/FgaFlowProduceData";
import { fgaEventConfirmCsv } from "metabase/new-service";
import { QueryClient, QueryClientProvider } from "react-query";

const FgaFlowUploadLayout = ({onSuccess, projectObject, cardId}) => {
  const { token } = theme.useToken();
  const [confirmCsvLoading, setConfirmCsvLoading] = useState();
  const [csvData, setCSVData] = useState([]);
  const [file, setFile] = useState()
  const [current, setCurrent] = useState(0);
  const projectId = projectObject?.id
  const [pipelineId, setPipelineId] = useState()
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
  const queryClient = new QueryClient();

  const propsUploadAvatarTcOss = {
    name: 'file',
    accept: '.csv',
    showUploadList: false,
    maxCount: 1,
    method: 'post',
    // eslint-disable-next-line no-undef
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
      // const data = info?.file?.response?.data?.previewData;
      // const pipelineId = info?.file?.response?.data?.pipelineId;
      // if (data) {
      //   setPipelineId(pipelineId)
      //   setCSVData(data)
      //   message.success("Upload CSV successfully");
      //   setTimeout(() => {
      //     setCurrent(current + 1);
      //   }, 1000);
      // }
      // console.log('upload onChange: ', info, data)
    },
  }

  const handleConfirmCSV = async () => {
    setConfirmCsvLoading(true)
    await fgaEventConfirmCsv({
      "projectId": projectId + "",
      "pipelineId": pipelineId,
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
          <div style={{marginBottom: 20}}>Pick Your Connector and Sync Your Data:</div>

            <Button className="w-full" >
              <Upload className="w-full" style={{width: "100%"}} name="avatar" {...propsUploadAvatarTcOss}>
                <div style={{width: 300, height: 30}}>CSV</div>
              </Upload>
            </Button>

          <Button
            onClick={() => {
              message.success("Coming soon...")
            }}
          >
            Mysql
          </Button>
          <Button
            onClick={() => {
              message.success("Coming soon...")
            }}
          >
            Postgres
          </Button>
        </div>
      ),
    },
    {
      title: 'Data Processing',
      content: (
        <FgaFlowDataProcess
          projectObject={projectObject}
          cardId={cardId}
          callbackData={(data, pipelineId) => {
            setPipelineId(pipelineId)
            setCSVData(data)
            setCurrent(current + 1)
          }}
          file={file}
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
          <Button onClick={() => setCurrent(0)}>Not quite right? Upload Again</Button>
          <Button loading={confirmCsvLoading} type="primary" onClick={() => {
            handleConfirmCSV()
          }}>{`Perfect! Let's Process the Data`}</Button>
        </div>
      </div>),
      onClick: () => setCurrent(2),
    },
    {
      title: 'Produce Data',
      content: (
        <QueryClientProvider client={queryClient}>
          <FgaFlowProduceData
            pipelineId={pipelineId}
            onSuccess={(isRefresh) => {
              onSuccess?.(isRefresh)
            }}
            onError={() => {
              setCurrent(0)
            }}
          />
        </QueryClientProvider>
      ),
    },
  ];
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


  return (
    <div className="flex flex-col" style={{width: 840, height: 560, marginTop: 20}}>
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
