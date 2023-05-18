/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { AutoComplete, Button, Divider, message, Modal, Tag } from "antd";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { omit, isArray, keys } from "lodash";
import {
  checkIsNeedContactUs,
  formatKeyLabel,
  getGrowthProjectPath,
  showCohortSuccessModal,
} from "metabase/growth/utils/utils";
import { getUser, getFgaProject } from "metabase/selectors/user";
import {
  createFgaProjectModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import { CreateOptimizeWallets2Cohort } from "metabase/new-service";

const CreateOptimizeCohort = ({
  btnText = "Save as cohort",
  onChangeLocation,
  project,
  disable = false,
  router,
  addressListCount,
  params = {},
  isButtonStyle = true,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [createCohortLoading, setCreateCohortLoading] = useState(false);
  const [cohortName, setCohortName] = useState();
  const addressList = [];

  const [modal, contextHolder] = Modal.useModal();
  const handleConditions = params => {
    const paramKeys = keys(
      omit(params, ["excludeTags", "excludeBot", "projectId", "cohortId"]),
    );
    const conditions = [];
    paramKeys.forEach(k => {
      conditions.push({ name: formatKeyLabel(k), value: params[k] });
    });
    return conditions;
  };
  const queryCondition = handleConditions(params);

  const getPanel = () => {
    return (
      <>
        {addressList && (
          <h4>
            You have selected {addressListCount?.toLocaleString("en-US")}{" "}
            addresses.
          </h4>
        )}
        <div className="p2 mt1" style={{ background: "#182034" }}>
          <h5>Criteria:</h5>
          <div className="mt1" />
          {queryCondition && (
            <>
              {queryCondition?.map((q, index) => {
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    {q.name}:{" "}
                    {isArray(q.value) ? (
                      q.value.map(t => {
                        return (
                          <Tag style={{ borderRadius: 5 }} key={t}>
                            {t}
                          </Tag>
                        );
                      })
                    ) : (
                      <Tag style={{ borderRadius: 5 }}>{q.value}</Tag>
                    )}
                  </div>
                );
              })}
            </>
          )}
          {(!queryCondition || queryCondition?.length <= 0) && (
            <>You have not yet established any filtering criteria.</>
          )}
        </div>
      </>
    );
  };

  const createCohortAction = async () => {
    if (!cohortName) {
      message.error("Please enter the name of your cohort.");
      return;
    }
    if (addressListCount === 0) {
      message.error("Please filter more address list");
      return;
    }
    setCreateCohortLoading(true);
    const requestParams = {
      ...omit(params, ["pageSize", "current", "excludeBot"]),
      title: cohortName,
    };
    console.log("requestParams", requestParams);
    const result = await CreateOptimizeWallets2Cohort(requestParams);
    setCohortModalOpen(false);
    setCreateCohortLoading(false);
    showCohortSuccessModal(modal, result, router, "Health Check", () => {
      onChangeLocation(getGrowthProjectPath(project?.protocolSlug, "Cohort"));
    });
  };
  return (
    <>
      {contextHolder}
      {isButtonStyle ? (
        <Button
          type="primary"
          disabled={disable}
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
          {btnText}
        </Button>
      ) : (
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
          {btnText}
        </div>
      )}

      <Modal
        open={isCohortModalOpen}
        onCancel={() => setCohortModalOpen(false)}
        footer={[
          <Button
            key="back"
            className=" rounded"
            onClick={() => setCohortModalOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className=" rounded"
            loading={createCohortLoading}
            onClick={createCohortAction}
          >
            Create
          </Button>,
        ]}
        closable={false}
        title={`${btnText}`}
      >
        <Divider className="my2" />
        <h4>Cohort Name</h4>
        <div className="mt1" />
        <AutoComplete
          style={{
            width: "100%",
          }}
          allowClear
          // options={options}
          onChange={value => {
            setCohortName(value.trim());
          }}
          placeholder="Enter the name of this cohort "
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {getPanel()}
        <div className="mb2" />
      </Modal>
      {contextHolder}
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
    project: getFgaProject(state),
    user: getUser(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateOptimizeCohort);
