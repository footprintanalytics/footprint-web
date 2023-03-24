/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Divider, Steps } from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import ConfigConnectors from "../components/config_panel/ConfigConnectors";
import ConfigFinish from "../components/config_panel/ConfigFinish";
import ConfigMapping from "../components/config_panel/ConfigMapping";
import ConfigBasicInfo from "../components/create_campaign/ConfigBasicInfo";
import "../css/utils.css";
const steps = [
  {
    title: "Campaign",
    key: "Campaign",
    description: "Config your campaign basic info",
  },
  {
    title: "Cohort",
    key: "Cohort",
    description: "Config the cohort of this campaign",
  },
  {
    title: "Notification",
    key: "Notification",
    description: "Setup the notification of this campaign",
  },
  {
    title: "Finsh",
    key: "Finsh",
    description: "Campaign config successfully",
  },
];
const CreateCampaign = props => {
  const { router, location, children, user } = props;
  const [current, setCurrent] = useState(1);
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
        return <ConfigBasicInfo onNext={onNext}></ConfigBasicInfo>;
      case "Cohort":
        return <ConfigConnectors onNext={onNext}></ConfigConnectors>;
      case "Notification":
        return <ConfigMapping onNext={onNext}></ConfigMapping>;
      case "Finsh":
        return <ConfigFinish></ConfigFinish>;
    }
  };
  return (
    <div className=" flex flex-column items-center">
      <div
        className="flex flex-column"
        style={{ maxWidth: 1000, minWidth: 500, width: "80%" }}
      >
        {/* <h1>New campaign</h1> */}
        <Steps
          current={current ? current - 1 : 0}
          // className="mt-5 px-10"
          // size="small"
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
        {current && <>{getCurrentConfigPanel(current)}</>}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CreateCampaign);
