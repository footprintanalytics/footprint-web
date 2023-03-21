/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, message, Modal, Tag, AutoComplete, Divider } from "antd";
import { connect } from "react-redux";
import { isArray } from "lodash";
import { CreateFgaCohort } from "metabase/new-service";
import { getLatestGAProjectId } from "metabase/growth/utils/utils";
import { getUser } from "metabase/selectors/user";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import MetabaseUtils from "metabase/lib/utils";

const CreateFliterCohort = ({
  state,
  style,
  propData,
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  btnText,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortName, setCohortName] = useState();
  const dashboardData = propData?.dashboard;
  const result = state?.series[0];
  const cardData = result?.card;
  const queryCondition = result?.json_query?.parameters;
  const queryConditionValue = propData?.parameterValues;
  queryCondition?.map(i => {
    i = { ...i, value: queryConditionValue[i.id] };
  });
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
      setCohortModalOpen(false);
      message.warning("Please sign in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "add cohort",
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
      dashboardId: MetabaseUtils.isUUID(dashboardData?.id)
        ? dashboardData?.entityId
        : dashboardData?.id,
      dashboardCardId: propData?.dashcard?.id,
      queryChartId: cardData?.id,
      queryCondition: queryCondition ?? [],
    };
    try {
      const result = await CreateFgaCohort(parms);
      if (result) {
        message.success("Successfully create a cohort!");
        setCohortModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getPannel = () => {
    return (
      <>
        {addressList && (
          <h4>You have selected {addressList?.length} wallet address.</h4>
        )}
        <div className="bg-light p2 mt1">
          <h5>Criteria:</h5>
          <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
          {/* <div className="mt1" /> */}
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

  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => {
          setCohortModalOpen(true);
        }}
      >
        {btnText ?? "Create Cohort"}
      </Button>

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
        title={`${btnText}`}
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
        {getPannel()}
        <div className="mb2" />
      </Modal>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};
const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFliterCohort);
