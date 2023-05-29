/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, message, Modal, Tag, AutoComplete, Divider } from "antd";
import { connect } from "react-redux";
import { isArray } from "lodash";
import { withRouter } from "react-router";
import { CreateFgaCohort } from "metabase/new-service";
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
import MetabaseUtils from "metabase/lib/utils";
import { FilterOut } from "metabase/growth/components/FilterOut";

const CreateFliterCohort = ({
  state,
  style,
  propData,
  user,
  router,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  btnText,
  project,
}) => {
  const [isCohortModalOpen, setCohortModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortName, setCohortName] = useState();
  const [filterOut, setFilterOut] = useState([]);
  const filterOutOptions = ["Bot", "Sybil"];
  const defaultFilterOut = [];
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
      message.error("Please enter segment name!");
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
    const projectId = project?.id ?? getLatestGAProjectId();
    if (!projectId) {
      setCohortModalOpen(false);
      message.warning("Please create your project before proceeding.");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    setLoading(true);
    const params = {
      title: cohortName,
      projectId: parseInt(projectId, 10),
      dashboardId: MetabaseUtils.isUUID(dashboardData?.id)
        ? dashboardData?.entityId
        : dashboardData?.id,
      dashboardCardId: propData?.dashcard?.id,
      queryChartId: cardData?.id,
      queryCondition: queryCondition ?? [],
    };
    const excludeIndex = queryCondition?.findIndex(
      item => item.slug === "exclude",
    );
    const value = [];
    if (filterOut?.includes("Sybil")) value.push("sybil");
    if (filterOut?.includes("Bot")) value.push("bot");
    if (excludeIndex > -1) {
      if (value.length) {
        params.queryCondition[excludeIndex].value = value;
      } else {
        params.queryCondition.splice(excludeIndex, 1);
      }
    } else {
      if (value.length) {
        params.queryCondition.push({
          type: "string/=",
          name: "Exclude",
          slug: "exclude",
          id: "b2ece640",
          sectionId: "fp_enum",
          remark: "bot,sybil",
          value,
          target: ["dimension", ["template-tag", "excludeTag"]],
        });
      }
    }
    try {
      console.log(params);
      const result = await CreateFgaCohort(params);
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

  const [modal, contextHolder] = Modal.useModal();
  useEffect(() => {
    const exclude = queryCondition?.find(item => item.slug === "exclude");
    if (exclude) {
      const _filterOut = [];
      if (exclude.value?.includes("sybil")) _filterOut.push("Sybil");
      if (exclude.value?.includes("bot")) _filterOut.push("Bot");
      setFilterOut(_filterOut);
    }
  }, [queryCondition]);

  const getPannel = () => {
    return (
      <>
        {addressList && (
          <h4>You have selected {addressList?.length} wallet address.</h4>
        )}
        {/* <div className="bg-light p2 mt1">
          <h5>Criteria:</h5>
          <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
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
        </div> */}
      </>
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        style={style}
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
        {btnText ?? "Create Segment"}
      </Button>

      <Modal
        className="dark"
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
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <div className="mt2" />
        {getPannel()}
        {/* <div className="mb2" />
        <FilterOut
          options={filterOutOptions}
          defaultValue={filterOut}
          onChange={setFilterOut}
        /> */}
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
    project: getFgaProject(state),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateFliterCohort),
);
