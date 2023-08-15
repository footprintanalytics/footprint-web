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
} from "metabase/ab/utils/utils";
import { getUser, getFgaProject } from "metabase/selectors/user";
import {
  createFgaProjectModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import { FilterOut } from "metabase/ab/components/FilterOut";
import {
  createCommunityUserCohort,
  createPotentialUserCohortByFilter,
  createPotentialUserTagging,
} from "metabase/new-service";

const CreateCohort2 = ({
  btnText = "Create Segment",
  onChangeLocation,
  project,
  disable = false,
  router,
  addressListCount,
  params = {},
  type = "Potential User",
  isButtonStyle = true,
  isTagging = false,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [createCohortLoading, setCreateCohortLoading] = useState(false);
  const filterOutOptions = ["Bot", "Sybil"];
  const [filterOutValues, setFilterOutValues] = useState(filterOutOptions);
  const [cohortName, setCohortName] = useState();
  const addressList = [];

  const [modal, contextHolder] = Modal.useModal();
  const handleConditions = params => {
    const paramKeys = keys(
      omit(params, ["pageSize", "current", "excludeTags", "projectId"]),
    );
    const conditions = [];
    paramKeys.forEach(k => {
      if (isArray(params[k]) && params[k].length > 0 && params[k] !== 0) {
        if (k === "filters") {
          conditions.push({
            name: formatKeyLabel(k),
            value: params[k].map(item => {
              return `${item.indicator} ${item.comparisonSymbol} ${item.comparisonValue}\n`;
            }),
          });
        } else {
          conditions.push({ name: formatKeyLabel(k), value: params[k] });
        }
      }
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

  const createPotentialUserApi = isTagging
    ? createPotentialUserTagging
    : createPotentialUserCohortByFilter;

  const createCohortAction = async () => {
    if (!cohortName) {
      message.error("Please enter the name of your segment.");
      return;
    }
    if (addressListCount === 0) {
      message.error("Please filter more address list");
      return;
    }
    setCreateCohortLoading(true);
    console.log("params", type, params);

    const filters = params.filters || [];
    if (filterOutValues?.length > 0) {
      filters.push({
        indicator: "excludeTags",
        comparisonSymbol: "in",
        comparisonValue: filterOutValues,
      });
    }
    try {
      const result =
        type === "Members"
          ? await createCommunityUserCohort({
              ...omit(params, ["pageSize", "current"]),
              title: cohortName,
              excludeTags: [...filterOutValues],
            })
          : await createPotentialUserApi({
              ...omit(params, ["pageSize", "current"]),
              title: cohortName,
              filters: filters,
            });
      setCohortModalOpen(false);
      if (isTagging) {
        message.success("Tagging Success");
      } else {
        showCohortSuccessModal(
          modal,
          result,
          router,
          type === "Members" ? "segment" : "find_wallets",
          () => {},
        );
      }
    } catch (error) {
      console.log("error", error);
    }
    setCreateCohortLoading(false);
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
        rootClassName="cohort_modal"
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
        <h4>{isTagging ? "Tag Name" : "Segment Name"}</h4>
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
          placeholder="Enter the name of this segment "
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {getPanel()}
        <div className="mb2" />
        <FilterOut
          options={filterOutOptions}
          defaultValue={filterOutOptions}
          onChange={values => setFilterOutValues(values)}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateCohort2);
