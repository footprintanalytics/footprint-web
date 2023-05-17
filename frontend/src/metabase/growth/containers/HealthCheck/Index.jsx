/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { mock_data } from "../../utils/mock_score_v2";
import LandingPage from "./LandingPage";
import ScanningPage from "./ScanningPage";
import OptimizePage from "./OptimizePage";
import ResultPage from "./ResultPage";
import "animate.css";

const Index = props => {
  const { router, location, user, project } = props;

  const [cohort, setCohort] = useState(null);
  //landing, scanning, result,optimizing
  const [currentStep, setCurrentStep] = useState("landing");
  const [mockData, setMockData] = useState([]);
  useEffect(() => {
    setMockData(processData(mock_data));
  }, []);

  const processData = data => {
    const result = [];
    const columns = data.columns;
    const rows = data.data;
    rows.map(row => {
      const obj = {};
      columns.map((column, index) => {
        obj[column.name] = row[index];
      });
      result.push(obj);
    });
    console.log("mockData result", columns, rows?.length, result);
    return result;
  };

  return (
    <div
      className="flex flex-column items-center p1"
      style={{ marginBottom: 100 }}
    >
      <div
        className=" mt-50 flex flex-column items-center"
        style={{ width: "100%", maxWidth: 1000, minWidth: 600 }}
      >
        {currentStep !== "landing" && (
          <div
            className="animate__animated animate__zoomIn  animate__faster flex flex-row items-center mx4 my2"
            style={{ width: "100%", maxWidth: 800 }}
          >
            <Button
              type="text"
              className="p0"
              onClick={() => {
                setCohort(null);
                setCurrentStep("landing");
              }}
            >
              <h2>
                <ArrowLeftOutlined />
                {" Health Check"}
              </h2>
            </Button>
          </div>
        )}
        {currentStep === "landing" && (
          <div>
            <LandingPage
              onSelectCohort={item => {
                setCohort(item);
                setCurrentStep("scanning");
              }}
            ></LandingPage>
          </div>
        )}
        {currentStep === "scanning" && (
          <div>
            <ScanningPage
              onCheckFinish={() => {
                setCurrentStep("result");
              }}
            ></ScanningPage>
          </div>
        )}
        {currentStep === "result" && (
          <div>
            <ResultPage
              data={mockData}
              onOptimize={() => {
                setCurrentStep("optimizing");
              }}
            ></ResultPage>
          </div>
        )}
        {currentStep === "optimizing" && (
          <div>
            <OptimizePage
              data={mockData}
              onOptimize={() => {
                setCurrentStep("optimizing");
              }}
            ></OptimizePage>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
  };
};

export default connect(mapStateToProps)(Index);
