/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { withRouter } from "react-router";
import {
  Button,
  message,
  Modal,
  AutoComplete,
  Input,
  Typography,
  Divider,
} from "antd";
import { connect } from "react-redux";
import { CreateFgaCohortByAddress } from "metabase/new-service";
import {
  checkIsNeedContactUs,
  getLatestGAProjectId,
  showCohortSuccessModal,
} from "metabase/growth/utils/utils";
import { getUser, getFgaProject } from "metabase/selectors/user";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
const { TextArea } = Input;

const UploadWallets = ({
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  btnText,
  refetchData,
  project,
  router,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortName, setCohortName] = useState();
  const [walletList, setWalletList] = useState([]);

  const onSend = async () => {
    if (
      checkIsNeedContactUs(
        modal,
        project,
        () => {},
        () => {
          setCohortModalOpen(false);
        },
        true,
      )
    ) {
      return;
    }

    if (!cohortName) {
      message.error("Please enter the name of your segment.");
      return;
    }
    if (walletList.length <= 0) {
      message.error("Please enter a valid wallet address.");
      return;
    }
    if (!user) {
      setCohortModalOpen(false);
      message.warning("Please sign in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "add segment",
        redirect: location.pathname,
        channel: "FGA",
      });
      return;
    }
    const projectId = getLatestGAProjectId();
    if (!projectId) {
      setCohortModalOpen(false);
      message.warning("Please create your project before proceeding.");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    setLoading(true);
    const parms = {
      title: cohortName,
      projectId: parseInt(projectId, 10),
      addressList: walletList ?? [],
    };
    try {
      const result = await CreateFgaCohortByAddress(parms);
      if (result) {
        // message.success("Successfully create a cohort!");
        showCohortSuccessModal(modal, result, router);
        refetchData?.();
        setCohortModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const parseWalletAddress = pasteValue => {
    if (pasteValue) {
      const newList = pasteValue
        .replaceAll(",", "\n")
        .replaceAll(" ", "\n")
        .split(/[\n\s]+/)
        .filter(item => isWalletAddress(item));
      setWalletList(newList);
    } else {
      setWalletList([]);
    }
  };

  const isWalletAddress = address => {
    return (
      address && address.toLowerCase().startsWith("0x") && address.length <= 42
    );
  };

  const getPannel = () => {
    return (
      <>
        <h5>
          Please enter all the addresses you wish to add to this new segment.
        </h5>
        <TextArea
          // value={pasteValue}
          style={{ marginTop: 20 }}
          onChange={e => {
            // setPasteValue(e.target.value);
            parseWalletAddress(e.target.value);
          }}
          placeholder="Please paste all the addresses you wish to add to this new segment, separated by line breaks ."
          autoSize={{ minRows: 10, maxRows: 15 }}
        />
        <div
          className="mt1 flex flex-row items-center justify-between full-width"
          style={{ fontSize: 12 }}
        >
          <div>
            Detect <span style={{ color: "red" }}>{walletList.length}</span>{" "}
            addresses.Up to <span style={{ color: "red" }}>1000</span> addresses
            can be processed at once.
          </div>
        </div>
      </>
    );
  };
  const [modal, contextHolder] = Modal.useModal();
  return (
    <>
      <div
        onClick={() => {
          checkIsNeedContactUs(
            modal,
            project,
            () => {
              setCohortModalOpen(true);
            },
            () => {},
            true,
          );
        }}
      >
        Upload Wallets
      </div>
      <Modal
        open={isCohortModalOpen}
        onCancel={() => setCohortModalOpen(false)}
        onOk={onSend}
        footer={[
          <Button key="back" onClick={() => setCohortModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onSend}
          >
            Create
          </Button>,
        ]}
        closable={false}
        title={`${btnText ?? "Upload to create segment"}`}
      >
        <Divider className="my2" />
        <h5>Segment Name</h5>
        <div className="mt1" />
        <AutoComplete
          style={{
            width: "100%",
          }}
          allowClear
          onChange={value => {
            setCohortName(value);
          }}
          // options={options}
          placeholder="Enter the name of this segment "
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {getPannel()}
        <div className="mb2" />
      </Modal>
      {contextHolder}
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};

const mapStateToProps = (state, props) => {
  return {
    project: getFgaProject(state),
    user: getUser(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UploadWallets),
);
