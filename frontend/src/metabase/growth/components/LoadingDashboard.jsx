/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Spin, Card } from "antd";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";

const LoadingDashboard = ({
  sourceDefinitionId,
  projectId,
  current_tab,
  children,
}) => {
  const { data } = useQuery(
    ["GetFgaConnectorJob", projectId],
    async () => GetFgaConnectorJob({ projectId, sourceDefinitionId }),
    {
      refetchInterval: data => (data?.status === "succeeded" ? false : 10000),
      enabled: !!sourceDefinitionId,
    },
  );

  const message = `Loading data, please wait...`;
  const description = `This may take a few minutes or a few hours, depending on the amount of data. Thank you for your patience.`;

  if (sourceDefinitionId && data?.status !== "succeeded") {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert
            message={message}
            description={description}
            type="info"
            showIcon
            icon={<Spin />}
          />
        </Card>
      </div>
    );
  } else {
    return children;
  }
};

export default LoadingDashboard;
