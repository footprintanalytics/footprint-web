/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { AutoComplete, Button, message, Modal, Tag } from "antd";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { omit, isArray, keys } from "lodash";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import { getUser } from "metabase/selectors/user";
import { createFgaProjectModalShowAction, loginModalShowAction } from "metabase/redux/control";
import { FilterOut } from "metabase/growth/components/FilterOut";
import { createPotentialUserCohort } from "metabase/new-service";

const CreateCohort2 = ({
  btnText = "Create Cohort",
  onChangeLocation,
  project,
  disable = false,
  addressListCount,
  params = {},
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [createCohortLoading, setCreateCohortLoading] = useState(false);
  const filterOutOptions = ["Bot", "Sybil"];
  const [filterOutValues, setFilterOutValues] = useState(filterOutOptions);
  const [cohortName, setCohortName] = useState();
  const addressList = [];

  const handleConditions = (params) => {
    const paramKeys = keys(omit(params, ["pageSize", "current", "excludeTags", "projectId"]));
    const conditions = [];
    paramKeys.forEach(k => {
      if (isArray(params[k]) && params[k].length > 0 && params[k] !== 0) {
        if (k === "filters") {
          conditions.push({ name: k, value: params[k].map(item => {
            return `${item.indicator} ${item.comparisonSymbol} ${item.comparisonValue}\n`
            }) })
        } else {
          conditions.push({ name: k, value: params[k] });
        }
      }
    })
    return conditions;
  }

  const queryCondition = handleConditions(params);

  const getPanel = () => {
    return (
      <>
        {addressList && (
          <h4>You have selected {addressListCount?.toLocaleString("en-US")} addresses.</h4>
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
  console.log("isCohortModalOpen", isCohortModalOpen)
  console.log("project", project)
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
    await createPotentialUserCohort({
      ...(omit(params, ["pageSize", "current"])),
      title: cohortName,
      excludeTags: [...filterOutValues],
    });
    console.log("params", params)
    setCreateCohortLoading(false);
    onChangeLocation(getGrowthProjectPath(project?.protocolSlug, "Cohort"));
  }
  console.log("filterOutValues",filterOutValues)
  return (
    <>
      <Button
        type="text"
        disabled={disable}
        onClick={() => {
          setCohortModalOpen(true);
        }}
      >
        {btnText}
      </Button>

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
            loading={createCohortLoading}
            onClick={createCohortAction}
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
        <FilterOut options={filterOutOptions} defaultValue={filterOutOptions} onChange={values => setFilterOutValues(values)}/>
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
