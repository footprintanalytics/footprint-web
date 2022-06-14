/* eslint-disable react/prop-types */
import React from "react";
import Step from "../Step";
import "./index.css";
import Info from "./Info";
import Dragger from "./Dragger";

const Prepare = ({ onNext }) => {
  return (
    <Step
      title="Step 1 of 2: Upload Data"
      desc="You can upload a CSV or Excel file from your computer."
      hidePrev={true}
      hideNext={true}
    >
      <div className="custom-upload__prepare">
        <Dragger onSuccess={onNext} />
        <Info />
      </div>
    </Step>
  );
};

export default Prepare;
