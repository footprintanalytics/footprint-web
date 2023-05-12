/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Alert,
  Breadcrumb,
  Progress,
  Typography,
  Spin,
  Avatar,
  Card,
  Divider,
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

const ResultPage = props => {
  const { router, children, user, project, onOptimize } = props;
  const ref = useRef();
  const [cohortId, setCohortId] = useState(router?.location?.query?.id);
  const [score, setScore] = useState(0);
  useEffect(() => {
    startCountdown(2000, 90);
  }, []);
  const startCountdown = (totalTime, targetScore) => {
    const intervalTime = 2000 / targetScore;
    let timerId = setInterval(() => {
      setScore(
        score => score + Math.floor(intervalTime / (totalTime / targetScore)),
      );
    }, intervalTime);
    setTimeout(() => {
      clearInterval(timerId);
      setScore(targetScore);
    }, totalTime + intervalTime);
  };
  const [checkItems, setCheckItems] = useState([
    {
      title: "Holdings score",
      icon: "https://static.footprint.network/img_da_bg_2022100833.png",
      items: [
        { title: "10% wallets are 20" },
        { title: "20% wallets are 40" },
        { title: "20% wallets are 60" },
        { title: "40% wallets are 80" },
        { title: "10% wallets are 100" },
      ],
    },
    {
      title: "Active score",
      icon: "https://static.footprint.network/img_da_bg_2022100834.png",
      items: [
        { title: "10% wallets are 20" },
        { title: "20% wallets are 40" },
        { title: "20% wallets are 60" },
        { title: "30% wallets are 80" },
        { title: "20% wallets are 100" },
      ],
    },
    {
      title: "Blacklist checking",
      icon: "https://static.footprint.network/img_da_bg_2022100832.png",
      items: [
        { title: "3% wallets are Bot" },
        { title: "6% wallets are Sybil" },
      ],
    },
    {
      title: "Trading volume",
      icon: "https://static.footprint.network/img_da_bg_2022100831.png",
      items: [
        { title: "40% wallets lower than avg trading volume" },
        { title: "60% wallets higher than avg trading volume" },
      ],
    },
  ]);

  return (
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 800, minWidth: 800 }}
    >
      <Card className="w-full rounded">
        <div className="flex flex-column items-center w-full p4">
          <div className="flex flex-row items-center w-full ">
            <div className="animate__animated animate__faster animate__zoomIn">
              <Progress
                type="circle"
                size={150}
                format={percent => (
                  <div className="flex flex-col items-center">
                    <span style={{ fontSize: 48, fontWeight: 600 }}>
                      {percent}
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 400, marginTop: 5 }}
                    >
                      Health Score
                    </span>
                  </div>
                )}
                percent={score}
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              />
            </div>
            <div className="flex-1 flex flex-col mx3 w-full animate__animated animate__faster animate__zoomIn">
              <h1> 3 points need to be optimized </h1>
              <div>
                <Button
                  className="mt2"
                  type="primary"
                  onClick={() => {
                    onOptimize?.();
                  }}
                >
                  Optimize wallet list
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full pb4">
            {checkItems.map((item, index) => {
              return (
                <div
                  key={item?.title}
                  style={{
                    alignItems: "flex-start",
                    // backgroundColor: "#131723",
                  }}
                  className={`animate__animated animate__faster animate__fadeInDown animate__delay-${
                    1 + index
                  } flex flex-row  w-full mt4 p2 rounded`}
                >
                  <div
                    className="flex flex-row items-center"
                    style={{ width: "40%" }}
                  >
                    <Avatar src={item?.icon} size={32}></Avatar>
                    <h2 className="ml1">{item.title} </h2>
                  </div>

                  <div className="flex flex-col flex-full ml2">
                    <h3 style={{ marginTop: 5 }}>
                      {item?.items?.length} optimization points were identified.
                    </h3>
                    {item?.items?.map((subItem, subIndex) => {
                      return (
                        <div key={subIndex} className="flex flex-row mt1">
                          <Typography.Text type="secondary" className="">
                            {subItem?.title}
                          </Typography.Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <Alert
            className={`w-full animate__animated animate__faster animate__fadeInDown animate__delay-${
              checkItems?.length + 1
            }`}
            message="23 wallets has no score."
            // description="23 wallets has no score."
            type="warning"
            showIcon
            // closable
          />
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

export default withRouter(connect(mapStateToProps)(ResultPage));
