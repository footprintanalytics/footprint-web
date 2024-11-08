/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Result, Spin, Timeline } from "antd";
import { fgaEventRecordDetail } from "metabase/new-service";
import { useQuery } from "react-query";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import { CheckCircleOutlined } from "@ant-design/icons";

const FgaFlowProduceData = ({ onSuccess, pipelineId, onError }) => {

  const [current, setCurrent] = useState(0);
  const [isAPIFinished, setIsAPIFinished] = useState(false);
  const { data } = useQuery(
    ["fgaEventRecordDetail"],
    async () => {
      return await fgaEventRecordDetail({ pipelineId: pipelineId });
    },
    {...QUERY_OPTIONS_NORMAL, enabled: !!pipelineId && !isAPIFinished, refetchInterval: 10000, onSuccess: (data) => {
      if (["finished", "sync_failed"].includes(data?.status)) {
        setIsAPIFinished(true);
      }
    }},
  );

  const timeItems =
    [
      {
        label: "Step 1: Synchronous Data Now ",
      },
      { label: "Step 2: ETL Data Now "},
    ]

  useEffect(() => {
    if (data?.status === "etl") {
      setCurrent(1);
    }
  }, [data]);
  return (
    <div className="flex flex-col justify-center line-height-2" style={{padding: 40, lineHeight: 1.5}}>
      {!["finished", "sync_failed"].includes(data?.status) && (
        <Result
          icon={<div />}
          title={"Data Brewing!"}
          subTitle={
            <div style={{ paddingTop: 30, paddingLeft: 60 }}>
              <Timeline>
                {timeItems.map((item, index) => (
                  <Timeline.Item
                    style={{display: "flex", justifyContent: "left"}}
                    key={index}
                    dot={<div className="bg-transparent">{
                      current > index ? <CheckCircleOutlined style={{ color: "green" }} /> : current === index ? <Spin /> : <div />
                    }</div>}
                  >
                    {item.label}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          }
          extra={
            <div className={"flex flex-col items-center"}>
              <span>Hang tight for about 3 minutes, or explore other dashboards and refresh later</span>
              <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.()}>View Dashboard</Button>
            </div>
          }
        />
      )}
      {data?.status === "finished" && (
        <Result
          status="success"
          title={"Data Brewing Done!"}
          subTitle={
            <div className={"flex flex-col items-center"}>
              <span>Check out your dashboard now</span>
              <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.(true)}>View Dashboard</Button>
            </div>
          }
        />
      )}
      {data?.status === "sync_failed" && (
        <Result
          status="error"
          title={"Data Brewing Error!"}
          subTitle={
            <div className={"flex flex-col items-center"}>
              <span>Check your data and upload data again!</span>
              <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onError?.()}>Upload Data Again</Button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default FgaFlowProduceData;
