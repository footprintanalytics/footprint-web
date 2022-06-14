/* eslint-disable react/prop-types */
import { Button } from "antd";
import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./index.css";

const Step = ({
  titleIcon,
  title,
  desc,
  hidePrev = false,
  hideNext = false,
  disabledNext = false,
  loadingNext = false,
  nextText,
  onPrev,
  onNext,
  children,
}) => {
  const Title = () => {
    return (
      <div className="custom-upload__step-info">
        <h2>
          {titleIcon}
          {title}
        </h2>
        <p>{desc}</p>
      </div>
    );
  };

  const Prev = () => {
    return (
      <Button
        size="large"
        onClick={onPrev}
        disabled={loadingNext}
        className="custom-upload__step-prev"
      >
        <LeftOutlined />
        Back
      </Button>
    );
  };

  const Next = () => {
    return (
      <Button
        loading={loadingNext}
        disabled={disabledNext}
        size="large"
        type="primary"
        onClick={onNext}
        className="custom-upload__step-next"
      >
        {nextText || "Proceed"}
        <RightOutlined />
      </Button>
    );
  };

  return (
    <div className="custom-upload__step">
      <Title />
      {children}
      <div className="custom-upload__step-action">
        {!hidePrev && <Prev />}
        {!hideNext && <Next />}
      </div>
    </div>
  );
};

export default Step;
