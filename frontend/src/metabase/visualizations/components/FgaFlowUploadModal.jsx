/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, message, Modal, Steps, Table, theme, Upload } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import FgaFlowDataProcess from "metabase/visualizations/components/FgaFlowDataProcess";
import FgaFlowProduceData from "metabase/visualizations/components/FgaFlowProduceData";
import { fgaEventConfirmCsv } from "metabase/new-service";
import "./FgaFlowUploadModal.css";

const FgaFlowUploadModal = ({onSuccess, projectObject, cardId, isModal, force, open, onCancel}) => {
  const { token } = theme.useToken();
  const [confirmCsvLoading, setConfirmCsvLoading] = useState();
  const [csvData, setCSVData] = useState([]);
  const [fileList, setFileList] = useState([]);
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

  useEffect(() => {
    if (!open) {
      setCurrent(0)
      setCSVData([])
      setFileList([])
      setPipelineId(null)
    }
  }, [open]);

  useEffect(() => {
    if (current === 0) {
      setFileList([])
    }
  }, [current])

  const queryClient = new QueryClient();

  const propsUploadAvatarTcOss = {
    name: 'file',
    accept: '.csv',
    multiple: true,
    showUploadList: true,
    maxCount: 10,
    method: 'post',
    fileList: fileList,
    // eslint-disable-next-line no-undef
    headers: {
    },
    data: {
      "projectId": projectId + "",
    },
    beforeUpload: async (file) => {
      setFileList(prev => [...prev, file]);
      return false;
    },
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange(info) {
      if (info.fileList.length > 0) {
        setTimeout(() => {
          setCurrent(current + 1);
        }, 500)
      }
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
                <div style={{width: 300, height: 30}}>Upload CSV Files (Max 10)</div>
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
          fileList={fileList}
          onUploadAgainClick={() => {
            setCurrent(0)
          }}
        />
      ),
      onClick: () => setCurrent(1),
    },
    {
      title: 'Preview Data',
      content: (
        <div className="flex flex-col" style={{ lineHeight: 1.5, padding: 20 }}>
          <div className="mb1">{"Here's a preview of your data (up to 10 rows). Please review and confirm."}</div>
          <Table
            className="dark-scrollbar"
            columns={columns}
            dataSource={csvData}
            pagination={false}
            scroll={{ y: 300 }}
          />
          <div className={"flex justify-center "} style={{ gap: 10, padding: 20 }}>
            <Button onClick={() => {
              setCurrent(0)
            }}>Not quite right? Upload Again</Button>
            <Button loading={confirmCsvLoading} type="primary" onClick={() => {
              handleConfirmCSV()
            }}>{`Perfect! Let's Process the Data`}</Button>
          </div>
        </div>
      ),
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


  const renderContent = () => {
    return (
      <div className="FgaFlowUploadContent" style={{ width: 840, height: 560, marginTop: 20 }}>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div className="flex justify-end" style={{ marginTop: 24 }}>
        </div>
      </div>
    );
  }

  if (!isModal) {
    return renderContent();
  }

  return (
    <Modal
      title={"Upload Data"}
      open={open}
      destroyOnClose
      footer={null}
      width={900}
      height={560}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {renderContent()}
    </Modal>
  );
};

export default FgaFlowUploadModal;
