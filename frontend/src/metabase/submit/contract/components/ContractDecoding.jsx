/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, message, Typography } from "antd";
import lottie from "lottie-web/build/player/lottie_svg";
import dayjs from "dayjs";
import { animation_complete2, data_scanning } from "./data-scanning";
// import "animate.css";
import { getRefBaseApi, submitFGAProtocols, submitRefProtocols } from "metabase/new-service";
import { isDark } from "metabase/dashboard/components/utils/dark";
import Link from "metabase/core/components/Link";
import { isABPath } from "metabase/ab/utils/utils";

const ContractDecoding = ({ param, onSuccess, fromFgaAddProject, backAction, toMyContracts }) => {
  const ref = useRef();
  const [showBack, setShowBack] = useState();
  const [logDatas, setLogDatas] = useState([
    { date: getTimeNow(), message: "start processing..." },
  ]);
  const [loadCompleted, setLoadCompleted] = useState(false);
  const [title, setTitle] = useState(
    fromFgaAddProject ? `Your project, [${param?.protocolName}], is currently being processed and will be completed within a few minutes.`: `The system is currently processing [${param?.protocolName}]`,
  );

  const endpoint = `wss://${getRefBaseApi().replace("https://", "")}/ws`;
  let socket;
  let animation = null;
  useEffect(() => {
    animation = loadAnimation();
    if (isABPath()) {
      handleHttp();
    } else {
      handleSocket();
    }
    return () => {
      socket?.close();
      animation?.destroy();
    };
  }, []);

  function getTimeNow() {
    return dayjs(new Date()).format("HH:mm:ss");
  }

  const handleHttp = () => {
    const params = {
      projectName: param?.protocolName,
      protocolSlug: param?.protocolSlug,
      protocolType: param?.projectCategory,
      projectId: param?.projectId,
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

    console.log("param?.contracts", param?.contracts)
    submitByHttpFga(params);
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
    // message.success("protocol process completed.");
    setLoadCompleted(true);
  };
  const SubmitSuccessFga = (res, protocolSlug) => {
    console.log("SubmitSuccessFga", res)
    animation = loadAnimation("completed");
    // setTitle(
    //   `FGA: Your project is created`,
    // );
    setLog("Process completed.");
    // message.success("protocol process completed.");
    setLoadCompleted(true);

    setTimeout(() => {
      onSuccess?.(protocolSlug);
    }, 1000)
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
  const submitByHttpFga = params => {
    submitFGAProtocols(params)
      .then(res => {
        SubmitSuccessFga(res, params.protocolSlug);
      })
      .catch(err => {
        setLog(`Error. Please retry later. ${err}`);
        console.log("submit protocol by http error=> ", err);
        if (fromFgaAddProject) {
          setShowBack(true)
        }
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
        {!fromFgaAddProject && (
          <Typography.Text type="secondary">
            This task may take a few minutes. You can check the results later by going to the <Link className="text-underline text-underline-hover" onClick={() => {toMyContracts?.()}}>My Submissions</Link>.
          </Typography.Text>
          )}
        {!fromFgaAddProject && (
          <Card
            bordered={false}
            className="w-full h-full flex-1"
            style={{
              backgroundColor: isDark() ? "": "var(--footprint-color-bg)",
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
        )}
        {!isABPath() && <div className=" mt-10 w-full flex flex-row-reverse">
          {loadCompleted && (
            <Button
              type="primary"
              onClick={() => {
                onSuccess?.();
              }}
            >
              My Submissions
            </Button>
          )}
        </div>
        }
        {showBack && backAction && (
          <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <div style={{ width: 120, marginTop: 10 }}>
              <Button onClick={backAction}>Go Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDecoding;
