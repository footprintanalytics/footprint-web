/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Divider, Steps } from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import ConfigConnectors from "../components/config_panel/ConfigConnectors";
import ConfigFinish from "../components/config_panel/ConfigFinish";
import ConfigMapping from "../components/config_panel/ConfigMapping";
import ConfigProject from "../components/config_panel/ConfigProject";
import "../css/utils.css";
const steps = [
  {
    title: "Step 1",
    key: "config_project",
    description: "Config your project",
  },
  {
    title: "Step 2",
    key: "config_connector",
    description: "Config connector",
  },
  {
    title: "Step 3",
    key: "config_mapping",
    description: "Config mapping data",
  },
  {
    title: "Step 4",
    key: "config_finish",
    description: "Finish config,view your data",
  },
];
const CreateProject = props => {
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
      case "config_project":
        return <ConfigProject onNext={onNext}></ConfigProject>;
      case "config_connector":
        return <ConfigConnectors onNext={onNext}></ConfigConnectors>;
      case "config_mapping":
        return <ConfigMapping onNext={onNext}></ConfigMapping>;
      case "config_finish":
        return <ConfigFinish></ConfigFinish>;
    }
  };
  return (
    <div style={{ background: "#f8fafb" }}>
      <Steps
        current={current ? current - 1 : 0}
        // className="mt-5 px-10"
        style={{ padding: 20 }}
        items={steps}
        onChange={value => {
          router.replace({
            pathname: location.pathname,
            query: { ...location.query, step: value + 1 },
          });
        }}
      />
      <Divider />
      {current && <>{getCurrentConfigPanel(current)}</>}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CreateProject);
