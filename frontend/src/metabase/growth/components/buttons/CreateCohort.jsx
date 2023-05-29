/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { withRouter } from "react-router";
import { Button, message, Modal, Dropdown, AutoComplete, Input, Typography } from "antd";
import { connect } from "react-redux";
import { CreateFgaCohortByAddress } from "metabase/new-service";
import {
  getLatestGAProjectId,
  getGrowthProjectPath,
  showCohortSuccessModal,
  checkIsNeedContactUs,
} from "metabase/growth/utils/utils";
import { getFgaProject, getUser } from "metabase/selectors/user";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import { FilterOut } from "metabase/growth/components/FilterOut";
const { TextArea } = Input;

const CreateCohort = ({
  style,
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  project,
  projectPath,
  btnText,
  router,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortName, setCohortName] = useState();
  const [walletList, setWalletList] = useState([]);
  const onSend = async () => {
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
        <h4>
          Please enter all the addresses you wish to add to this new segment.
        </h4>
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
        <div className=" flex flex-row items-center justify-between full-width">
          <div>
            Detect <span style={{ color: "red" }}>{walletList.length}</span>{" "}
            addresses.Up to <span style={{ color: "red" }}>1000</span> addresses
            can be processed at once.
          </div>
        </div>
      </>
    );
  };

  const items = [
    {
      label: "Filter wallets",
      key: "filter",
    },
    {
      label: "Upload wallets",
      key: "upload",
    },
  ];
  const onMenuItemClick = ({ key }) => {
    if (checkIsNeedContactUs(modal, project)) {
      return;
    }
    switch (key) {
      case "upload":
        setCohortModalOpen(true);
        break;
      case "filter":
        router?.push({
          pathname: getGrowthProjectPath(projectPath, "Potential Users"),
        });
        break;
    }
  };

  const [modal, contextHolder] = Modal.useModal();
  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{ items, onClick: onMenuItemClick }}
        placement="bottom"
        arrow={{ pointAtCenter: true }}
      >
        <Button type="primary" style={style} onClick={e => e.preventDefault()}>
          {btnText ?? "Create segment"}
        </Button>
      </Dropdown>
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
        <Typography>
          <h3>Segment Name</h3>
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
              option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
          <div className="mt2" />
          {getPannel()}
          <div className="mb2" />
          <FilterOut />
        </Typography>
      </Modal>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateCohort),
);
