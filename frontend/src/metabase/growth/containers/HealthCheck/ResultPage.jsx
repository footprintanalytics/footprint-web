/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Button, Alert, Progress, Typography, Avatar, Card } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import "animate.css";
import { calculateAvgScore } from "metabase/growth/utils/utils";

const ResultPage = props => {
  const { router, children, user, project, onOptimize, data, noScoreCount } =
    props;
  const [cohortId, setCohortId] = useState(router?.location?.query?.id);
  const [score, setScore] = useState(0);
  const [healthScore, setHealthScore] = useState(0);
  useEffect(() => {
    if (healthScore > 0) {
      startCountdown(2000, healthScore);
    }
  }, [healthScore]);
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

  useEffect(() => {
    if (data?.length > 0) {
      setHealthScore(calculateAvgScore(data, "fgaScore").toFixed(0));
      const tradingVolumeAvg = calculateAvgScore(data, "tradingVolume");
      const holdingScores = [0, 0, 0, 0, 0];
      const activityScores = [0, 0, 0, 0, 0];
      let botCount = 0;
      let lessAvgTradingVolume = 0;
      let moreAvgTradingVolume = 0;
      data.forEach(item => {
        item.botScore >= 60 && botCount++;
        item.tradingVolume < tradingVolumeAvg
          ? lessAvgTradingVolume++
          : moreAvgTradingVolume++;
        item.holdingScore < 20 && holdingScores[0]++;
        20 <= item.holdingScore && item.holdingScore < 40 && holdingScores[1]++;
        40 <= item.holdingScore && item.holdingScore < 60 && holdingScores[2]++;
        60 <= item.holdingScore && item.holdingScore < 80 && holdingScores[3]++;
        80 <= item.holdingScore &&
          item.holdingScore <= 100 &&
          holdingScores[4]++;
        item.activityScore < 20 && activityScores[0]++;
        20 <= item.activityScore &&
          item.activityScore < 40 &&
          activityScores[1]++;
        40 <= item.activityScore &&
          item.activityScore < 60 &&
          activityScores[2]++;
        60 <= item.activityScore &&
          item.activityScore < 80 &&
          activityScores[3]++;
        80 <= item.activityScore &&
          item.activityScore <= 100 &&
          activityScores[4]++;
      });
      const items = [];
      const holdingScoreItems = {
        title: "Wallet holding value check",
        icon: "https://static.footprint.network/img_da_bg_2022100833.png",
        items: [],
      };
      holdingScores.forEach((item, index) => {
        if (item <= 0) {
          return;
        }
        holdingScoreItems.items.push({
          title: `${((item / data.length) * 100).toFixed(
            2,
          )}% wallets are between ${index * 20} and ${(index + 1) * 20}.`,
          status: index <= 1 ? "error" : index <= 3 ? "warning" : "success",
        });
      });
      items.push(holdingScoreItems);
      const activityScoreItems = {
        title: "On-chain activities check",
        icon: "https://static.footprint.network/img_da_bg_2022100834.png",
        items: [],
      };
      activityScores.forEach((item, index) => {
        if (item <= 0) {
          return;
        }
        activityScoreItems.items.push({
          title: `${((item / data.length) * 100).toFixed(
            2,
          )}% wallets are between ${index * 20} and ${(index + 1) * 20}.`,
          status: index <= 1 ? "error" : index <= 3 ? "warning" : "success",
        });
      });

      const tradingVolumeItems = {
        title: "Trading volume check",
        icon: "https://static.footprint.network/img_da_bg_2022100831.png",
        items: [],
      };

      if (lessAvgTradingVolume > 0) {
        tradingVolumeItems.items.push({
          title: `${((lessAvgTradingVolume / data.length) * 100).toFixed(
            2,
          )}% wallets lower than avg trading volume`,
          status: "warning",
        });
      }
      if (moreAvgTradingVolume > 0) {
        tradingVolumeItems.items.push({
          title: `${((moreAvgTradingVolume / data.length) * 100).toFixed(
            2,
          )}% wallets higher than avg trading volume`,
          status: "success",
        });
      }

      setCheckItems([
        holdingScoreItems,
        activityScoreItems,
        {
          title: "Blacklist checking",
          icon: "https://static.footprint.network/img_da_bg_2022100832.png",
          items: [
            {
              title: `${((botCount / data.length) * 100).toFixed(
                2,
              )}% wallets more than 60`,
              status: "error",
            },
          ],
        },
        tradingVolumeItems,
      ]);
    }
  }, [data]);
  const [checkItems, setCheckItems] = useState([]);

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
            {noScoreCount > 0 && (
              <Alert
                className={`w-full animate__animated animate__faster animate__zoomIn mt4`}
                message={`${noScoreCount} wallets has no score.`}
                // description="23 wallets has no score."
                type="warning"
                showIcon
                // closable
              />
            )}

            {checkItems.map((item, index) => {
              return (
                <div
                  key={item?.title}
                  style={{
                    alignItems: "flex-start",
                    // backgroundColor: "#131723",
                  }}
                  className={` flex flex-row  w-full mt4 p2 rounded animate__animated animate__faster animate__zoomIn`}
                >
                  <div
                    className="flex flex-row items-center"
                    style={{ width: "40%" }}
                  >
                    <div style={{ width: 54, height: 54 }}>
                      <Avatar src={item?.icon} size={54}></Avatar>
                    </div>

                    <h2 className="ml1">{item.title} </h2>
                  </div>

                  <div className="flex flex-col flex-full ml2">
                    <h3 style={{ marginTop: 5 }}>
                      {item?.items?.filter(i => i.status != "success")?.length}{" "}
                      optimization points were identified.
                    </h3>
                    {item?.items?.map((subItem, subIndex) => {
                      return (
                        <div
                          key={subIndex}
                          className={`flex flex-row mt1 justify-between animate__animated animate__faster animate__fadeInDown animate__delay-${
                            1 + subIndex
                          }`}
                        >
                          <Typography.Text type="secondary" className="">
                            {subItem?.title}
                          </Typography.Text>
                          <Avatar
                            className={`animate__animated animate__faster animate__rotateIn animate__animated animate__faster animate__fadeInDown animate__delay-${
                              2 + subIndex
                            }`}
                            src={
                              subItem.status === "success"
                                ? "https://static.footprint.network/20220317121550.png?x-oss-process=image/resize,m_fill,h_100,w_100"
                                : subItem.status === "warning"
                                ? "https://static.footprint.network/icon_warning.png?x-oss-process=image/resize,m_fill,h_100,w_100"
                                : "https://static.footprint.network/icon_error.png?x-oss-process=image/resize,m_fill,h_100,w_100"
                            }
                            size={18}
                          ></Avatar>
                        </div>
                      );
                    })}
                  </div>
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

export default withRouter(connect(mapStateToProps)(ResultPage));
