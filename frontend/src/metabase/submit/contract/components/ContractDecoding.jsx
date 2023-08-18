/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState, useRef, useEffect } from "react";
import { Typography, Card, message, Button } from "antd";
import lottie from "lottie-web/build/player/lottie_svg";
import {
  data_scanning,
  animation_complete,
  animation_complete2,
} from "./data-scanning";
import "animate.css";

const ContractDecoding = ({ param, onSuccess }) => {
  const ref = useRef();
  const [logDatas, setLogDatas] = useState(["start processing..."]);
  const [loadCompleted, setLoadCompleted] = useState(false);
  const [title, setTitle] = useState(
    `The system is currently processing [${param?.protocolName}]`,
  );
  const domain = window.location.hostname;
  const endpoint =
    domain === "localhost"
      ? "ws://localhost:7081" // local test
      : "wss://ref-api-adapter.footprint.network/ws"; // production
  // const endpoint = "wss://ref-api-adapter.footprint.network/ws";
  const socket = new WebSocket(endpoint);
  let animation = null;
  useEffect(() => {
    animation = loadAnimation();
    handleSocket();
    return () => {
      socket?.close();
      animation?.destroy();
    };
  }, []);

  const handleSocket = () => {
    try {
      socket.onopen = function () {
        console.log("Connected");
        socket.send(
          JSON.stringify({
            event: "submit_protocol",
            data: {
              protocol_name: param?.protocolName,
              protocol_slug: param?.protocolSlug,
              protocol_type: param?.projectCategory,
              website: param?.website,
              email: param?.email,
              contracts: param?.contracts,
              source: "web_user",
            },
          }),
        );
        socket.onmessage = function (msg) {
          console.log("get msg ", msg);
          const data = JSON.parse(msg.data);
          if (data?.event === "done" || data === "done") {
            animation = loadAnimation("completed");
            setTitle(
              `The system is currently process [${param?.protocolName}] completed.`,
            );
            setLogDatas(datas => {
              return [...datas, "protocol process completed."];
            });
            message.success("protocol process completed.");
            socket?.close();
            setLoadCompleted(true);
            return;
          }
          setLogDatas(datas => {
            return [...datas, `${data?.data?.message ?? data}`];
          });
        };
      };
    } catch (error) {
      console.log("error=> ", error);
      socket?.close();
    }
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
              return <div key={index}>{log}</div>;
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
