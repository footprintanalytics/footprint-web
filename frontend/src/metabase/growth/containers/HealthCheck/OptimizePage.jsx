/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Row,
  Checkbox,
  Slider,
  Typography,
  Spin,
  Avatar,
  Card,
  Divider,
  Button,
} from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import lottie from "lottie-web/build/player/lottie_svg";
import { withRouter } from "react-router";
import cx from "classnames";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import { GetFgaCohort } from "metabase/new-service";
import { data_scanning } from "../../utils/data-scanning";
const { Text } = Typography;
import "animate.css";

const OptimizePage = props => {
  const { router, children, user, project, onOptimize } = props;
  const [cohortId, setCohortId] = useState(router?.location?.query?.id);
  const [score, setScore] = useState(0);

  const health_score_chart = useRef(null);
  const trading_volumn_chart = useRef(null);
  const wallet_account_chart = useRef(null);

  useEffect(() => {
    const chartHealth = window.echarts.init(health_score_chart.current);
    const chartTrading = window.echarts.init(trading_volumn_chart.current);
    const chartWallet = window.echarts.init(wallet_account_chart.current);
    chartHealth.setOption(option);
    chartTrading.setOption(option);
    chartWallet.setOption(option);
  }, []);

  const option = {
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
    animationEasing: "bounceOut",
    animationDelayUpdate: function (idx) {
      return idx * 100;
    },
    series: [
      {
        data: [200, 140],
        type: "bar",
        barWidth: 20,
        markLine: {
          animationEasing: "bounceOut",
          animationDelay: function (idx) {
            return idx * 200;
          },
          Animation: true,
          lineStyle: {
            type: "dashed",
          },
          label: {
            show: false, // 不显示标记线上的数值
          },
          data: [[{ type: "max" }, { type: "min" }]],
        },
      },
    ],
  };

  return (
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 800, minWidth: 800 }}
    >
      <Card className="w-full rounded">
        <div className="flex flex-row justify-between w-full ">
          <div className="flex flex-column p2 flex-full">
            <h3>Holdings score</h3>
            <div
              id="health_score_chart"
              ref={health_score_chart}
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
              <Button type="primary">Check wallet list</Button>
              <Button type="default" className="ml2">
                Save as cohort
              </Button>
            </div>
          </div>

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
              defaultValue={80}
              max={100}
              min={0}
              marks={{ 0: "0", 100: "100" }}
              onAfterChange={value => {
                console.log("adjust Holdings score", value);
              }}
            />
            <h3 className="mt4">Active score</h3>
            <Slider
              className="mt2"
              defaultValue={80}
              max={100}
              min={0}
              marks={{ 0: "0", 100: "100" }}
              onAfterChange={value => {
                console.log("adjust Active score", value);
              }}
            />
            <h3 className="mt4">{"Exclude(blacklist)"}</h3>
            <Checkbox.Group
              className="mt2"
              style={{ width: "100%" }}
              defaultValue={["Bot", "Sybil"]}
              onChange={checkedValue =>
                console.log("Active score", checkedValue)
              }
            >
              <Row>
                <Col span={24}>
                  <Checkbox value="Bot">Bot</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="Sybil">Sybil</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
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
