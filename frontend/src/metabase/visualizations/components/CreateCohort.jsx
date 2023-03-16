/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, message, Modal, Tag, AutoComplete, Divider } from "antd";
import { connect } from "react-redux";
import { CreateFgaCohort } from "metabase/new-service";
import { getLatestGAProjectId } from "metabase/growth/utils/utils";
import { getUser } from "metabase/selectors/user";
import MetabaseUtils from "metabase/lib/utils";
import { isArray } from "lodash";

const CreateCohort = ({ state, style, propData, user }) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [cohortName, setCohortName] = useState();
  const dashboardData = propData?.dashboard;
  const result = state?.series[0];
  const cardData = result?.card;
  const queryCondition = result?.json_query?.parameters;
  const queryConditionValue = propData?.parameterValues;
  queryCondition?.map(i => {
    i = { ...i, value: queryConditionValue[i.id] };
  });
  const projectId = getLatestGAProjectId();
  const addressIndex = result?.data?.cols?.findIndex(f =>
    f?.display_name?.toLowerCase()?.includes("address"),
  );
  const addressList =
    addressIndex >= 0
      ? result?.data?.rows?.map(f => f[addressIndex])?.filter(f => !!f)
      : null;
  const onSend = async () => {
    if (!cohortName) {
      message.error("Please enter cohort name!");
      return;
    }
    if (!user) {
      message.warning("Please sign in before proceeding.");
      return;
    }
    if (!projectId) {
      message.warning("Please create your project before proceeding.");
      return;
    }
    const hide = message.loading("Loading...", 10);
    const parms = {
      title: cohortName,
      projectId: parseInt(projectId, 10),
      dashboardId: MetabaseUtils.isUUID(dashboardData?.id)
        ? dashboardData?.entityId
        : dashboardData?.id,
      dashboardCardId: propData?.dashcard?.id,
      queryChartId: cardData?.id,
      queryCondition: queryCondition ?? [],
    };
    const result = await CreateFgaCohort(parms);
    hide();
    if (result) {
      message.success("Successfully create a cohort!");
      setIsTagModalOpen(false);
    }
    // setTimeout(() => {
    //   hide();
    //   message.success("Create cohort successfully");
    //   setIsTagModalOpen(false);
    // }, 2000);
  };
  const handleChange = value => {
    console.log(`selected ${value}`);
  };
  
  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => {
          setIsTagModalOpen(true);
        }}
      >
        Create Cohort
      </Button>

      <Modal
        open={isTagModalOpen}
        onCancel={() => setIsTagModalOpen(false)}
        onOk={onSend}
        okText="create"
        closable={false}
        title="Create cohort"
      >
        <h3>Cohort Name</h3>
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
          placeholder="Enter the name of this cohort "
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {addressList && (
          <h4>You have selected {addressList?.length} wallet address.</h4>
        )}
        <div className="bg-light p2 mt1">
          <h5>Condition:</h5>
          <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
          {/* <div className="mt1" /> */}
          {queryCondition && (
            <>
              {queryCondition?.map((q, index) => {
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    {q.name}:{" "}
                    {isArray(q.value) ?
                      q.value.map(t => {
                        return <Tag key={t}>{t}</Tag>;
                      }) :
                      (<span>{q.value}</span>)
                    }
                  </div>
                );
              })}
            </>
          )}
        </div>
        {/* <Select
          mode="tags"
          style={{
            width: "100%",
            marginTop: 20,
          }}
          disabled={cohortName ? false : true}
          placeholder="Tag those address by the way~"
          onChange={handleChange}
          options={optionsTag}
        /> */}
        <div className="mb2" />
      </Modal>
    </>
  );
};
const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CreateCohort);
