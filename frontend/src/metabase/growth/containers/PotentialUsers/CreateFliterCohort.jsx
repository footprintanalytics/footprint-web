/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { AutoComplete, Button, Divider, Modal } from "antd";
import { connect } from "react-redux";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import { getUser } from "metabase/selectors/user";
import { createFgaProjectModalShowAction, loginModalShowAction } from "metabase/redux/control";
import { FilterOut } from "metabase/growth/components/FilterOut";
import { push } from "react-router-redux";

const CreateCohort2 = ({
  btnText = "Create Cohort",
  onChangeLocation,
  project,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const addressList = [];
  const queryCondition = null;
  const getPannel = () => {
    return (
      <>
        {addressList && (
          <h4>You have selected {addressList?.length} wallet address.</h4>
        )}
        {/*<div className="bg-light p2 mt1">*/}
        {/*  <h5>Criteria:</h5>*/}
        {/*  <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>*/}
        {/*  /!* <div className="mt1" /> *!/*/}
        {/*  {(!queryCondition || queryCondition?.length <= 0) && (*/}
        {/*    <>You have not yet established any filtering criteria.</>*/}
        {/*  )}*/}
        {/*</div>*/}
      </>
    );
  };
  return (
    <>
      <div
        onClick={() => {
          setCohortModalOpen(true);
        }}
      >
        {btnText}
      </div>

      <Modal
        open={isCohortModalOpen}
        onCancel={() => setCohortModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setCohortModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => onChangeLocation(getGrowthProjectPath(project, "Cohort"))}
          >
            Create
          </Button>,
        ]}
        closable={false}
        title={`${btnText}`}
      >
        <h3>Cohort Name</h3>
        <div className="mt1" />
        <AutoComplete
          style={{
            width: "100%",
          }}
          allowClear
          // options={options}
          placeholder="Enter the name of this cohort "
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {getPannel()}
        <div className="mb2" />
        <FilterOut />
      </Modal>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
  onChangeLocation: push,
};
const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCohort2);
