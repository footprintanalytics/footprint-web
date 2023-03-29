/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Divider, Steps } from "antd";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getCampaignTemplate } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import ConfigConnectors from "../components/config_panel/ConfigConnectors";
import ConfigFinish from "../components/config_panel/ConfigFinish";
import ConfigMapping from "../components/config_panel/ConfigMapping";
import ConfigBasicInfo from "../components/create_campaign/ConfigBasicInfo";
import "../css/utils.css";
const steps = [
  {
    title: "Start",
    key: "Start",
    // description: "Start to Config campaign",
  },
  {
    title: "Content",
    key: "Campaign",
    // description: "Config your campaign basic info",
  },
  {
    title: "Cohort",
    key: "Cohort",
    // description: "Config the cohort of this campaign",
  },
  {
    title: "Channel",
    key: "Channel",
    // description: "Setup the notification of this campaign",
  },
  {
    title: "Finish",
    key: "Finish",
    // description: "Campaign config successfully",
  },
];
const CreateCampaignPage2 = props => {
  const {
    router,
    location,
    children,
    project,
    user,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
  } = props;
  const [current, setCurrent] = useState(1);

  const { isLoading, data } = useQuery(
    ["getCampaignTemplate"],
    getCampaignTemplate,
    QUERY_OPTIONS,
  );
  useEffect(() => {
    if (!isLoading) {
      console.log("getCampaignTemplate data", data);
    }
  }, [isLoading]);

  useEffect(() => {
    if (location.query.step) {
      const new_step = location.query.step;
      if (new_step !== current) {
        setCurrent(new_step);
      }
    } else {
      setCurrent(1);
    }
  }, [current, location.query.step]);
  const onNext = () => {
    let temp_current = current ? current : 1;
    temp_current++;
    router.replace({
      pathname: location.pathname,
      query: { ...location.query, step: temp_current },
    });
  };
  const getCurrentConfigPanel = step => {
    if (step === undefined || step > steps.length) {
      return <></>;
    }
    const key = steps[step - 1].key;
    switch (key) {
      case "Campaign":
        return (
          <ConfigBasicInfo
            onNext={onNext}
            location={location}
            router={router}
            project={project}
            user={user}
            setCreateFgaProjectModalShowAction={
              setCreateFgaProjectModalShowAction
            }
            setLoginModalShowAction={setLoginModalShowAction}
            campaignTemplate={data?.list}
          ></ConfigBasicInfo>
        );
      case "Cohort":
        return <ConfigConnectors onNext={onNext}></ConfigConnectors>;
      case "Notification":
        return <ConfigMapping onNext={onNext}></ConfigMapping>;
      case "Finish":
        return <ConfigFinish></ConfigFinish>;
    }
  };
  return (
    <div className=" flex flex-column items-center">
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
      ) : (
        <div
          className="flex flex-column mt3 bg-white rounded"
          style={{ maxWidth: 1000, minWidth: 500, width: "80%" }}
        >
          {/* <h1>New campaign</h1> */}
          <Steps
            current={current ? current - 1 : 0}
            // className="mt-5 px-10"
            direction="vertical"
            size="small"
            style={{ padding: 20 }}
            items={steps}
            onChange={value => {
              router.replace({
                pathname: location.pathname,
                query: { ...location.query, step: value + 1 },
              });
            }}
          />
          <Divider style={{ marginTop: 0, marginBottom: 20 }} />
          {/* {current && <>{getCurrentConfigPanel(current)}</>} */}
        </div>
      )}
    </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCampaignPage2);
