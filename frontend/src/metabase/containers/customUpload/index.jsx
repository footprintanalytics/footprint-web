/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Confirm from "./components/Confirm";
import Prepare from "./components/Prepare";
import Result from "./components/Result";
import * as Urls from "metabase/lib/urls";
import "./index.css";

const Index = ({ router }) => {
  const [step, setStep] = useState(
    "PREPARE",
    // "CONFIRM",
    // "RESULT",
  );
  const [prepareData, setPrepareData] = useState();

  return (
    <div className="custom-upload">
      {step === "PREPARE" && (
        <Prepare
          onNext={prepareData => {
            setPrepareData(prepareData);
            localStorage.setItem("rawPrepareData", JSON.stringify(prepareData));
            setStep("CONFIRM");
          }}
        />
      )}
      {step === "CONFIRM" && (
        <Confirm
          prepareData={prepareData}
          onPrev={() => setStep("PREPARE")}
          onNext={() => setStep("RESULT")}
          onPrepareDataChange={newPrepareData => {
            setPrepareData(newPrepareData);
            console.log(newPrepareData);
          }}
        />
      )}
      {step === "RESULT" && (
        <Result
          prepareData={prepareData}
          onNext={() => router.replace(Urls.newQuestion())}
        />
      )}
    </div>
  );
};

export default Index;
