/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
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

const ScanningPage = props => {
  const { router, children, user, project, onCheckFinish, fetching } = props;
  const ref = useRef();
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: data_scanning,
    });
    // animation.play();
    startCountdown(8000);
    return () => {
      animation?.destroy();
    };
  }, []);
  useEffect(() => {
    if (!loading && !fetching) {
      onCheckFinish?.();
    }
  }, [loading, fetching]);

  const startCountdown = totalTime => {
    setLoading(true);
    const intervalTime = 100;
    let timerId = setInterval(() => {
      setPercent(percent => {
        const newPercent =
          percent + Math.ceil((intervalTime * 100) / totalTime);
        return newPercent > 99 ? 99 : newPercent;
      });
    }, intervalTime);
    setTimeout(() => {
      clearInterval(timerId);
      setLoading(false);
      // onCheckFinish?.();
    }, totalTime + intervalTime);
  };

  const [checkItems, setCheckItems] = useState([
    {
      title: "Wallet holding value check",
      description: "Analyzing the performance of wallet holdings score.",
      status: "success",
      percent: 100,
      icon: "https://static.footprint.network/img_da_bg_2022100833.png",
    },
    {
      title: "On-chain activities check",
      description: "Analyzing the performance of wallet active score.",
      status: "success",
      percent: 100,
      icon: "https://static.footprint.network/img_da_bg_2022100834.png",
    },
    {
      title: "Blacklist checking",
      description: "Analyzing how many wallet in the blacklist.",
      status: "warning",
      percent: 100,
      icon: "https://static.footprint.network/img_da_bg_2022100832.png",
    },
    {
      title: "Trading volume check",
      description: "Analyzing the performance of wallet trading volume.",
      status: "warning",
      percent: 100,
      icon: "https://static.footprint.network/img_da_bg_2022100831.png",
    },
  ]);
  return (
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 800, minWidth: 800 }}
    >
      <Card className="w-full rounded">
        <div className="flex flex-column items-center w-full pb4">
          <div className="flex flex-row items-center  w-full ">
            <div
              className="animate__animated animate__faster animate__zoomIn"
              ref={ref}
              style={{ width: 250, height: 250 }}
            />
            <div className="flex-full flex flex-col pl3 pr4 animate__animated animate__faster animate__zoomIn">
              <h1> Assessing the health status of this group. </h1>
              {percent < 100 && (
                <Progress
                  className="mt2"
                  percent={percent}
                  status="active"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                />
              )}
              {percent >= 100 && (
                <div>
                  <Button
                    className="mt2"
                    type="primary"
                    onClick={() => {
                      onCheckFinish?.();
                    }}
                  >
                    View result detail
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* <Divider></Divider> */}
          <div className="flex flex-col w-full px4 pb4">
            {checkItems.map((item, index) => {
              const flag = (index + 1) * (100 / checkItems?.length);
              return (
                <div
                  key={item?.title}
                  className={`animate__animated animate__faster animate__fadeInDown animate__delay-${
                    1 + index
                  } flex flex-row items-center align-center w-full mt4`}
                >
                  <Avatar src={item?.icon} size={54}></Avatar>
                  <div className="flex flex-col flex-full ml2">
                    <h3>{item.title} </h3>
                    <Typography.Text ellipsis className="flex-1 mr1">
                      {item.description}
                    </Typography.Text>
                  </div>
                  {percent < flag && (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 24,
                          }}
                          spin
                        />
                      }
                    />
                  )}
                  {percent >= flag && (
                    <Avatar
                      className="animate__animated animate__faster animate__rotateIn"
                      src={
                        item.status === "success"
                          ? "https://static.footprint.network/20220317121550.png?x-oss-process=image/resize,m_fill,h_100,w_100"
                          : item.status === "warning"
                          ? "https://static.footprint.network/icon_warning.png?x-oss-process=image/resize,m_fill,h_100,w_100"
                          : ""
                      }
                      size={24}
                    ></Avatar>
                  )}
                </div>
              );
            })}
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

export default withRouter(connect(mapStateToProps)(ScanningPage));
