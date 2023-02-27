/* eslint-disable react/prop-types */
import React, { createContext } from "react";
import { Modal, Select, Button } from "antd";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";

const CreateProjectModal = props => {
  const { open, onCancel } = props;
  // monitor datas
  const normalOptions = [
    {
      value: "BAYC",
      key: "BAYC",
      label: "BAYC",
    },
    {
      value: "Moonbird",
      key: "Moonbird",
      label: "Moonbird",
    },
    {
      value: "AlienWar",
      key: "AlienWar",
      label: "AlienWar",
    },
    {
      value: "Decentraland",
      key: "Decentraland",
      label: "Decentraland",
    },
    {
      value: "FootprintNFT",
      key: "FootprintNFT",
      label: "FootprintNFT",
    },
    {
      value: "Era7",
      key: "Era7",
      label: "Era7",
    },
    {
      value: "the-sandbox",
      key: "the-sandbox",
      label: "The Sandbox",
    },
    {
      value: "sunflower-farmers",
      key: "sunflower-farmers",
      label: "Sunflower Farmers",
    },
  ];
  return (
    <Modal
      title="Create your own project"
      open={open}
      footer={null}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <div className="flex flex-column">
        Select the protocol of your project
        <Select
          showSearch
          style={{ width: "100%", marginTop: 20 }}
          // value={currentProject}
          // onChange={handleProjectChange}
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={normalOptions}
        />
        <Link
          style={{ width: "100%", marginTop: 10 }}
          href="submit/contract/add"
        >
          Can not find the protocol? Submit now!
        </Link>
        <Button
          type="primary"
          key="Create"
          style={{ width: "100%", marginTop: 50 }}
          onClick={() => {
            // setIsModalOpen(true);
          }}
        >
          Create Now
        </Button>
      </div>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(CreateProjectModal));
