/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState, useRef, useEffect } from "react";
import { Typography, Card, message, Button } from "antd";
import lottie from "lottie-web/build/player/lottie_svg";
import dayjs from "dayjs";
import {
  data_scanning,
  animation_complete,
  animation_complete2,
} from "./data-scanning";
import "animate.css";
import { getRefBaseApi, submitRefProtocols } from "metabase/new-service";

const ContractDecoding = ({ param, onSuccess }) => {
  const ref = useRef();
  const [logDatas, setLogDatas] = useState([
    { date: getTimeNow(), message: "start processing..." },
  ]);
  const [loadCompleted, setLoadCompleted] = useState(false);
  const [title, setTitle] = useState(
    `The system is currently processing [${param?.protocolName}]`,
  );

  const endpoint = `wss://${getRefBaseApi().replace("https://", "")}/ws`;
  let socket;
  let animation = null;
  useEffect(() => {
    animation = loadAnimation();
    handleSocket();
    return () => {
      socket?.close();
      animation?.destroy();
    };
  }, []);

  function getTimeNow() {
    return dayjs(new Date()).format("HH:mm:ss");
  }

  const handleSocket = () => {
    const params = {
      protocol_name: param?.protocolName,
      protocol_slug: param?.protocolSlug,
      protocol_type: param?.projectCategory,
      website: param?.website,
      username: param?.username,
      email: param?.email,
      twitter: param?.twitter,
      discord: param?.discord,
      telegram: param?.telegram,
      github: param?.github,
      logo: param?.logo,
      description: param?.description,
      contracts: param?.contracts,
      source: "web_user",
    };
    console.log("handleSocket => ", params);
    try {
      socket = new WebSocket(endpoint);
      socket.onerror = function (error) {
        console.error("WebSocket on error: ", error);
        submitByHttp(params);
      };
      socket.onopen = function () {
        console.log("Connected");
        socket.send(
          JSON.stringify({
            event: "submit_protocol",
            data: params,
          }),
        );
        socket.onmessage = function (msg) {
          console.log("on message: ", msg);
          const data = JSON.parse(msg.data);
          if (data?.event === "done" || data === "done") {
            socket?.close();
            SubmitSuccess();
            return;
          }
          setLog(`${data?.data?.message ?? data}`);
        };
      };
    } catch (error) {
      console.log("error=> ", error);
      socket?.close();
      submitByHttp(params);
    }
  };

  const SubmitSuccess = () => {
    animation = loadAnimation("completed");
    setTitle(
      `The system is currently process [${param?.protocolName}] completed.`,
    );
    setLog("protocol process completed.");
    message.success("protocol process completed.");
    setLoadCompleted(true);
  };
  const setLog = log => {
    setLogDatas(datas => {
      return [
        ...datas,
        {
          date: getTimeNow(),
          message: log,
        },
      ];
    });
  };
  const submitByHttp = params => {
    setLog("start submit protocol by http.");
    submitRefProtocols(params)
      .then(res => {
        SubmitSuccess();
      })
      .catch(err => {
        setLog("submit protocol by http error.Please retry later");
        console.log("submit protocol by http error=> ", err);
      })
      .finally(() => {});
  };

  const loadAnimation = type => {
    animation?.destroy();
    switch (type) {
      case "completed":
        return lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: animation_complete2,
        });
      case "scanning":
      default:
        return lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data_scanning,
        });
    }
  };

  return (
    <div className="w-full flex flex-row">
      <div
        className="animate__animated animate__faster animate__zoomIn"
        ref={ref}
        style={{ width: 200, height: 200 }}
      />
      <div className="w-full flex flex-col p3">
        <Typography.Title level={5}>{title}</Typography.Title>
        <Typography.Text type="secondary">
          This task may take a few minutes. You can come back later to check the
          results.
        </Typography.Text>
        <Card
          bordered={false}
          className="w-full h-full flex-1"
          style={{
            backgroundColor: "var(--footprint-color-bg)",
            height: 290,
            overflow: "auto",
          }}
        >
          <div className="flex flex-column-reverse w-full ">
            {logDatas?.map((log, index) => {
              return (
                <div key={index} className="flex flex-row w-full mb1">
                  <Typography.Text type="secondary" className="mr1 text-nowrap">
                    {`${log.date}:`}
                  </Typography.Text>
                  <Typography.Text type="success" className="flex-1">
                    {log.message}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        </Card>
        <div className=" mt-10 w-full flex flex-row-reverse">
          {loadCompleted && (
            <Button
              type="primary"
              style={{ width: 100 }}
              onClick={() => {
                onSuccess?.();
              }}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDecoding;
