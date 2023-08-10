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
  const [logDatas, setLogDatas] = useState(["start scanning..."]);
  const [loadCompleted, setLoadCompleted] = useState(false);
  const [title, setTitle] = useState(`${param?.protocolName} is decoding...`);
  const domain = "wss://ref-api-adapter.footprint.network/ws";
  const socket = new WebSocket(domain);
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
              protocol: param?.protocolName,
              website: param?.website,
              email: param?.email,
              contracts: param?.contracts,
            },
          }),
        );
        socket.onmessage = function (msg) {
          console.log("get msg ", msg);
          const data = JSON.parse(msg.data);
          if (data?.event === "completed" || data === "done") {
            animation = loadAnimation("completed");
            setTitle(`${param?.protocolName} is decode completed.`);
            setLogDatas(datas => {
              return [...datas, "contract decoding completed."];
            });
            message.success("contract decoding completed.");
            socket?.close();
            setLoadCompleted(true);
            return;
          }
          setLogDatas(datas => {
            return [...datas, data];
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
        <Typography.Title level={4}>{title}</Typography.Title>
        <Card
          bordered={false}
          className="w-full h-full flex-1"
          style={{
            backgroundColor: "var(--footprint-color-bg)",
            height: 160,
          }}
        >
          <div className="w-full h-full flex flex-col">
            <Typography.Paragraph
              style={{ whiteSpace: "pre-wrap" }}
              type="secondary"
              className="w-full h-full"
              ellipsis={{ rows: 6 }}
            >
              {logDatas?.reverse()?.join("\n")}
            </Typography.Paragraph>
            {/* {logDatas?.reverse()?.map((item, index) => {
              if (index < 5) {
                return (
                  <Typography.Text key={index} type="secondary">
                    {item}
                  </Typography.Text>
                );
              }
            })} */}
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
