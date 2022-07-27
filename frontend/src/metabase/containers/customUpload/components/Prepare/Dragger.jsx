/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { getOssUrl } from "metabase/lib/image";
import { saveAs } from "file-saver";
import { getProject } from "metabase/lib/project_info";
import { loginModalShowAction } from "metabase/redux/control";
import { connect } from "react-redux";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";

const Dragger = ({ user, setLoginModalShow, onSuccess }) => {
  const project = getProject();
  const [prepareRes, setPrepareRes] = useState({});
  const [needPermissionModal, setNeedPermissionModal] = useState(false);

  const props = {
    action: "/api/v1/custom/data/upload/csv/prepare",
    accept: ".xls,.xlsx,.csv",
    showUploadList: false,
    withCredentials: true,
    data: { project },
    beforeUpload: () => {
      if (user?.limitUpload < 1) {
        setNeedPermissionModal(true);
        return false;
      }
    },
    onChange: ({ file }) => {
      setPrepareRes(file);
      if (file?.response?.code) return message.error(file.response.message);
      if (file.response?.data) onSuccess(file.response?.data);
    },
  };

  return (
    <>
      <div className="custom-upload__prepare-dragger">
        <Upload.Dragger {...props}>
          <UploadBrowse
            prepareRes={prepareRes}
            user={user}
            setLoginModalShow={setLoginModalShow}
          />
          <DownloadTemplate />
        </Upload.Dragger>
      </div>
      {needPermissionModal && (
        <NeedPermissionModal
          title="Upgrade your account to unlock upload"
          onClose={() => setNeedPermissionModal(false)}
        />
      )}
    </>
  );
};

const UploadBrowse = ({ user, setLoginModalShow, prepareRes }) => {
  return (
    <>
      <img src={getOssUrl("20220317115501.png")} alt="upload" />
      <p className="custom-upload__prepare-dragger-msg">
        Drop file to upload
        <br />
        or
      </p>
      <Button
        size="large"
        type="primary"
        loading={prepareRes.status === "uploading"}
        className="custom-upload__prepare-dragger-browse"
        onClick={e => {
          if (!user) {
            e.stopPropagation();
            setLoginModalShow({ show: true, from: "Dragger" });
          }
        }}
      >
        Click to browse
      </Button>
    </>
  );
};

const DownloadTemplate = () => {
  return (
    <p className="custom-upload__prepare-dragger-template">
      Having problems? Try the{" "}
      <a
        onClick={e => {
          e.stopPropagation();
          saveAs(getOssUrl("temp_data.xlsx"), "temp_data.xlsx");
        }}
      >
        template
      </a>
    </p>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dragger);
