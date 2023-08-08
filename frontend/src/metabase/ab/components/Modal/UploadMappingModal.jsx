/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Select,
  Button,
  Input,
  Upload,
  message,
  Divider,
  Typography,
  Avatar,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import Papa from "papaparse";
import { InboxOutlined } from "@ant-design/icons";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { uploadMapping } from "metabase/new-service"
import { uploadFile2 } from "metabase/lib/oss";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";

const UploadMappingModal = props => {
  const { open, onCancel, onSuccess, router, location, user, force, project } =
    props;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const propsUpload = {
    // name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv",
    beforeUpload: async file => {
      const isCsv = file.type === "text/csv";
      if (!isCsv) {
        message.error("You can only upload CSV file!");
        return false;
      }
      if (file.size > 1024 * 1024 * 5) {
        message.warning("Max size of 5MB");
        return false;
      }
      validFile(file);
      return false;
    },
    showUploadList: false,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  async function handleUpload(file) {
    const fileName = `fga/upload_contact/${user?.name}-${user?.id}_${
      project?.protocolSlug
    }_${uuidv4()}.csv`;
    await uploadFile2({ fileName, file });
    const fileUrl = `https://static.footprint.network/${fileName}`;
    console.log("fileUrl => ", fileUrl);
    setUploadedFile({ file, fileUrl });
    setLoading(false);
  }

  function validFile(file) {
    setLoading(true);
    const requiredFields = [
      "wallet_address",
      "discord_id",
      "discord_name",
      "email",
      "twitter_id",
      "twitter_name",
      "github",
      "telegram",
      "twitter_slug",
      "discord_avatar",
      "twitter_avatar",
    ];
    Papa.parse(file, {
      complete: function (results, file) {
        const missFilds = [];
        requiredFields.forEach(field => {
          if (!results?.meta?.fields?.includes(field)) {
            console.log("Missing field", field);
            missFilds.push(field);
          }
        });
        if (missFilds.length > 0) {
          message.error(`Missing fields: ${missFilds.join(", ")}`);
          setLoading(false);
        } else {
          calFieldDatas(results.data);
          handleUpload(file);
        }
      },
      error: function (error, file) {
        console.log("Error:", error, file);
        message.error("Error parsing file");
        setLoading(false);
      },
      header: true,
    });
  }
  const [fieldDatas, setFieldDatas] = useState(null);
  const calFieldDatas = (datas) => {
    let numberOfWalletAddress = 0;
    let numberOfDiscordName = 0;
    let numberOfEmail = 0;
    let numberOfTwitterName = 0;
    datas.forEach(data => {
      if (data.wallet_address) numberOfWalletAddress++;
      if (data.discord_name) numberOfDiscordName++;
      if (data.email) numberOfEmail++;
      if (data.twitter_name) numberOfTwitterName++;
    });
    const result = {
      numberOfWalletAddress,
      numberOfDiscordName,
      numberOfEmail,
      numberOfTwitterName,
    }
    setFieldDatas(result)
  }

  const [createLoading, setCreateLoading] = useState(false);
  const createMapping = (url) => {
    setCreateLoading(true)
    uploadMapping({
      projectId:parseInt(project?.id),
      url,
      numberOfWalletAddress:fieldDatas?.numberOfWalletAddress,
      numberOfDiscordName:fieldDatas?.numberOfDiscordName,
      numberOfEmail:fieldDatas?.numberOfEmail,
      numberOfTwitterName:fieldDatas?.numberOfTwitterName,
    }).then(res => {
        message.success("Your CSV file import was successful!");
        onSuccess?.()
    }).catch(err => {
      message.error("Your CSV file import was failed!");
      console.log("createMapping err => ", err);
    }).finally(() => {
      setCreateLoading(false)
    });
  }

  return (
    <Modal
      title={
        <div className="text-bold text-center">
          <Avatar
            src={`https://footprint-imgs.oss-us-east-1.aliyuncs.com/upload_mapping_green.png`}
            size={25}
            className="bg-white mr1"
          ></Avatar>
          Import CSV
        </div>
      }
      open={open}
      footer={null}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <Divider style={{ marginTop: 20, marginBottom: 10 }}></Divider>
      <Typography.Text>
        Download{" "}
        <Typography.Link
          onClick={() => {
            message.info("Your download will begin shortly.");
            window.open(
              "https://static.footprint.network/fga/upload-template.csv",
              "_blank",
            );
          }}
        >
          Template
        </Typography.Link>
      </Typography.Text>
      <div className=" mt-10">
        {!uploadedFile ? (
          <Dragger {...propsUpload} style={{ color: "white" }}>
            <p className="ant-upload-drag-icon">
              {loading ? (
                <LoadingSpinner
                  style={{ width: 48, height: 48 }}
                ></LoadingSpinner>
              ) : (
                <InboxOutlined style={{ width: 48, height: 48 }} />
              )}
            </p>
            <p style={{ color: "white" }}>Import CSV File</p>
            <p style={{ color: "white" }}>
              Please click or drag a CSV file to this area for uploading.
            </p>
          </Dragger>
        ) : (
          <div
            className="flex flex-col items-center justify-center p2"
            style={{ borderRadius: 8, border: "1px dashed #d9d9d9" }}
          >
            <Typography.Title level={4}>Upload Success</Typography.Title>
            <Typography.Text className=" text-center">
              File:{" ./"}
              {uploadedFile?.file?.name}
            </Typography.Text>
            <div className=" mt2">
              <Button
                type="default"
                onClick={() => {
                  // save file link to server
                  setUploadedFile(null);
                }}
              >
                Reset
              </Button>
              <Button
                className=" ml-10"
                type="primary"
                loading={createLoading}
                onClick={() => {
                  // save file link to server
                  createMapping(uploadedFile?.fileUrl);
                }}
              >
                Comfirm & Save
              </Button>
            </div>
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
