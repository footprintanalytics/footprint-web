/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import * as Urls from "metabase/lib/urls";
import { getUser } from "metabase/selectors/user";
import Confirm from "./components/Confirm";
import Prepare from "./components/Prepare";
import Result from "./components/Result";
import "./index.css";
import { isFgaPath } from "metabase/growth/utils/utils"

const Index = ({ router, user }) => {
  const [step, setStep] = useState(
    "PREPARE",
    // "CONFIRM",
    // "RESULT",
  );
  const [prepareData, setPrepareData] = useState();
  const isFga = isFgaPath()
  return (
    <div className={`custom-upload`}>
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
          user={user}
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

const mapStateToProps = (state) => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(Index);
