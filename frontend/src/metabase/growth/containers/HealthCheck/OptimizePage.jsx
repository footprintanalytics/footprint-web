/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Checkbox, Slider, Typography, Card, Button } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import "animate.css";
import { calculateAvgScore } from "metabase/growth/utils/utils";
import CreateOptimizeCohort from "./CreateOptimizeCohort";

const OptimizePage = props => {
  const {
    router,
    children,
    user,
    project,
    onOptimize,
    data = [],
    cohort,
  } = props;
  const [fillterParams, setFillterParams] = useState({
    holdingScore: parseInt(calculateAvgScore(data, "holdingScore").toFixed(0)),
    activityScore: parseInt(
      calculateAvgScore(data, "activityScore").toFixed(0),
    ),
    botScore: 60,
    excludeBot: true,
  });
  const [filterResult, setFilterResult] = useState([]);
  const holding_score_chart = useRef(null);
  const trading_volumn_chart = useRef(null);
  const wallet_account_chart = useRef(null);

  useEffect(() => {
    if (data?.length > 0 && filterResult?.length >= 0) {
      const chartHolding = window.echarts.init(holding_score_chart.current);
      const chartTrading = window.echarts.init(trading_volumn_chart.current);
      const chartWallet = window.echarts.init(wallet_account_chart.current);
      chartHolding.setOption(
        parseOption([
          calculateAvgScore(data, "holdingScore"),
          calculateAvgScore(filterResult, "holdingScore"),
        ]),
      );
      chartTrading.setOption(
        parseOption([
          calculateAvgScore(data, "tradingVolume"),
          calculateAvgScore(filterResult, "tradingVolume"),
        ]),
      );
      chartWallet.setOption(parseOption([data?.length, filterResult?.length]));
    }
  }, [data, filterResult]);

  useEffect(() => {
    console.log("fillterParams data", fillterParams, data);
    if (data?.length > 0 && fillterParams) {
      const result = data.filter(
        item =>
          item.holdingScore >= fillterParams.holdingScore &&
          item.activityScore >= fillterParams.activityScore &&
          item.botScore <= fillterParams.botScore,
        // (fillterParams.excludeBot ? item.botScore < 60 : true),
      );
      setFilterResult(result);
      // chartWallet?.setOption(option([data?.length, result?.length]));
    }
  }, [data, fillterParams]);

  const parseOption = (datas = [200, 120]) => {
    const tempDatas = datas.map((item, index) => {
      return {
        value: item,
        itemStyle: {
          color:
            index === 0 ? "#1890ff" : item > datas[0] ? "#3CB371" : "#DAA520",
        },
      };
    });
    return {
      xAxis: {
        type: "category",
        data: ["before", "after"],
      },
      yAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      label: {
        show: false,
      },
      animationEasing: "bounceOut",
      animationDelayUpdate: function (idx) {
        return idx * 100;
      },
      series: [
        {
          data: tempDatas,
          type: "bar",
          barWidth: 20,
          markLine: datas[0] !== datas[1] && {
            animationEasing: "bounceOut",
            animationDelay: function (idx) {
              return idx * 200;
            },
            Animation: true,
            lineStyle: {
              type: "dashed",
            },
            label: {
              show: false,
            },
            data: [
              datas[0] === datas[1]
                ? { type: "average" }
                : datas[0] > datas[1]
                ? [{ type: "max" }, { type: "min" }]
                : [{ type: "min" }, { type: "max" }],
            ],
          },
        },
      ],
    };
  };

  return (
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 800, minWidth: 800 }}
    >
      <Card className="w-full rounded">
        <div className="flex flex-row justify-between w-full ">
          {/* config pannel */}
          <div
            className="flex flex-column p2"
            style={{
              width: "30%",
              backgroundColor: "#131723",
              borderRadius: "8px",
            }}
          >
            <h3>Holdings score</h3>
            <Slider
              className="mt2"
              defaultValue={fillterParams.holdingScore}
              max={100}
              min={0}
              marks={{ 0: "0", 100: "100" }}
              onAfterChange={value => {
                setFillterParams({ ...fillterParams, holdingScore: value });
              }}
            />
            <h3 className="mt4">Active score</h3>
            <Slider
              className="mt2"
              defaultValue={fillterParams.activityScore}
              max={100}
              min={0}
              marks={{ 0: "0", 100: "100" }}
              onAfterChange={value => {
                setFillterParams({ ...fillterParams, activityScore: value });
              }}
            />
            <h3 className="mt4">Bot score</h3>
            <Slider
              className="mt2"
              defaultValue={fillterParams.botScore}
              max={100}
              min={0}
              marks={{ 0: "0", 100: "100" }}
              onAfterChange={value => {
                setFillterParams({ ...fillterParams, botScore: value });
              }}
            />
            {/* <h3 className="mt4">{"Exclude(blacklist)"}</h3>
            <Checkbox.Group
              className="mt2"
              style={{ width: "100%" }}
              defaultValue={fillterParams.excludeBot ? ["Bot"] : []}
              onChange={checkedValue => {
                setFillterParams({
                  ...fillterParams,
                  excludeBot: checkedValue.includes("Bot"),
                });
              }}
            >
              <Row>
                <Col span={24}>
                  <Checkbox value="Bot">Bot</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group> */}
          </div>
          <div className="flex flex-column p2 flex-full ml2">
            <h3>Holdings score</h3>
            <div
              id="holding_score_chart"
              ref={holding_score_chart}
              style={{ width: "100%", height: 300 }}
            />
            <h3>Wallet account</h3>
            <div
              id="wallet_account_chart"
              ref={wallet_account_chart}
              style={{ width: "100%", height: 300 }}
            />
            <h3>Trading volume per wallet</h3>
            <div
              id="trading_volumn_chart"
              ref={trading_volumn_chart}
              style={{ width: "100%", height: 300 }}
            />

            <div className="flex flex-row items-center justify-center mt4 w-full">
              {/* <Button type="primary">Check wallet list</Button> */}
              {/* <Button type="primary" className="ml2">
                Save as cohort
              </Button> */}
              <CreateOptimizeCohort
                project={project}
                router={router}
                params={{
                  ...fillterParams,
                  projectId: project?.id,
                  cohortId: cohort?.cohortId,
                }}
                addressListCount={filterResult?.length}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
    // </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

export default withRouter(connect(mapStateToProps)(OptimizePage));
