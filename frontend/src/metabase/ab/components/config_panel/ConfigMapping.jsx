/* eslint-disable react/prop-types */
import React from "react";
import { message, Upload, Card, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const ConfigMapping = props => {
  const { onNext } = props;
  return (
    <div
      className="flex flex-col w-full"
      style={{
        alignItems: "center",
      }}
    >
      <Card style={{ width: 600 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Upload mapping file</p>
          <p className="ant-upload-hint">
            Click or drag file to this area to upload
          </p>
        </Dragger>
        <div className="flex w-full flex-row-reverse mt-10">
          <Button htmlType="button" onClick={onNext} className="ml-10">
            Skip
          </Button>
          <Button type="primary" htmlType="submit" className="bg-blue-500">
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfigMapping;
