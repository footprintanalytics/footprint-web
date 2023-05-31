/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Select,
  Button,
  Input,
  Form,
  message,
  Divider,
  Typography,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { CreateFgaProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

const UploadMappingModal = props => {
  const { open, onCancel, onSuccess, router, location, user, force } = props;
  const [uploadedFile, setUploadedFile] = useState(null);
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    showUploadList: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setUploadedFile(info.file);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Modal
      title="Upload Mapping"
      open={open}
      footer={null}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <Divider></Divider>
      <div >
        {!uploadedFile ? (
          <Dragger {...propsUpload} style={{ color: "white" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p style={{ color: "white" }}>Upload mapping file</p>
            <p style={{ color: "white" }}>
              Click or drag a csv file to this area to upload
            </p>
          </Dragger>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Typography.Title level={4}>Upload Success</Typography.Title>
            <Typography.Text>File:{uploadedFile.name}</Typography.Text>
            <Button className=" mt2" type="primary" onClick={()=>{
              // save file link to server
              console.log("save file link to server\n", uploadedFile);
            }}>Save</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(UploadMappingModal));
