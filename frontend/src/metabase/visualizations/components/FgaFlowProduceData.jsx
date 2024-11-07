/* eslint-disable react/prop-types */
import React from "react";
import { Button, Result, Spin } from "antd";
import { fgaEventRecordDetail } from "metabase/new-service";
import { useQuery } from "react-query";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";

const FgaFlowProduceData = ({ onSuccess, pipelineId, onError }) => {

  const { data } = useQuery(
    ["fgaEventRecordDetail"],
    async () => {
      return await fgaEventRecordDetail({ pipelineId: pipelineId });
    },
    {...QUERY_OPTIONS_NORMAL, enabled: !!pipelineId, refetchInterval: 10000 },
  );

  return (
    <div className="flex flex-col justify-center line-height-2" style={{padding: 40, lineHeight: 1.5}}>
      {!data?.status && (
        <Result
          icon={<Spin/>}
          title={"Data Brewing!"}
          subTitle={
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
              <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.()}>View Dashboard</Button>
            </div>
          }
        />
      )}
      {data?.status === "sync_failed" && (
        <Result
          status="success"
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
