/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Upload,
  Button,
  message,
  Avatar,
  Tooltip,
  Typography,
  Image,
  Spin,
} from "antd";
import { uploadFile } from "metabase/lib/oss";
import { getSuffix } from "metabase/containers/news/util/handle";
import { staticBucketUrlDefault } from "metabase/env";
import { v4 as uuidv4 } from "uuid";
import { ossPath } from "metabase/lib/ossPath";
import "./FormAvatarWidget.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getOssUrl } from "metabase/lib/image";

const FormAvatarWidget = ({ values, onChangeField }) => {
  const [loading, setLoading] = useState(false);

  const uploadProps = {
    accept: ".png, .jpg, .jpeg, .gif",
    showUploadList: false,
    beforeUpload: async file => {
      if (file.size > 1024 * 1024 * 1) {
        message.warning("Max size of 1MB");
        return false;
      }
      setLoading(true);
      const fileName = `avatar/${uuidv4()}${getSuffix(file.name)}`;
      await uploadFile({ fileName, file });
      const fileUrl = `${staticBucketUrlDefault}/${ossPath(fileName)}`;
      onChangeField("avatar", fileUrl);
      setLoading(false);
    },
  };

  return (
    <div className="FormAvatarWidget">
      {values?.avatar ? (
        <Image
          key={values.avatar}
          className="FormAvatarWidget__avatar"
          src={values.avatar + "?x-oss-process=image/resize,m_fill,h_120,w_120"}
          width={80}
          height={80}
          preview={false}
          placeholder={
            <div className="FormAvatarWidget__avatar--loading">
              <Spin />
            </div>
          }
        />
      ) : (
        <Avatar
          className="FormAvatarWidget__avatar"
          style={{ backgroundColor: "#E3E3FF" }}
        >
          {String(values?.name[0]).toUpperCase()}
        </Avatar>
      )}
      <div className="FormAvatarWidget__action">
        <p className="FormAvatarWidget__action-tip">
          JPG, PNG or GIF. Max size of 1MB
        </p>
        <div className="FormAvatarWidget__action-btn">
          <Upload {...uploadProps} disabled={loading}>
            <Button loading={loading}>Upload photo</Button>
          </Upload>
          <Button type="link" onClick={() => onChangeField("avatar", "")}>
            Remove photo
          </Button>
        </div>
        <div className="FormAvatarWidget__action-screenshot">
          <InfoCircleOutlined />
          When you share a screenshot, your profile will be displayed.
          <Tooltip
            overlayClassName="FormAvatarWidget__action-screenshot-example"
            placement="bottom"
            title={
              <img
                src={getOssUrl("20220518163754.png")}
                width={750}
                height={416}
              />
            }
          >
            <Typography.Link>example</Typography.Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FormAvatarWidget;
