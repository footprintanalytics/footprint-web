/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Card, Typography } from "antd";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";

const LoadingDashboard = ({
  sourceDefinitionId,
  router,
  project,
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

  const connector =
    current_tab === "User Funnel" ? "Google Analytics" : current_tab;

  if (!sourceDefinitionId) {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert
            message="You haven't connected any data yet"
            description={
              <>
                Please go to{" "}
                <Typography.Link
                  underline
                  onClick={() => {
                    router.push(
                      getGrowthProjectPath(project.projectName, "Connector"),
                    );
                  }}
                >
                  Settings {">"} Connector {">"} {connector}
                </Typography.Link>{" "}
                to connect your data and start analyzing.
              </>
            }
            type="warning"
            showIcon
          />
        </Card>
      </div>
    );
  } else if (sourceDefinitionId && data?.status !== "succeeded") {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert
            message="Loading data, please wait..."
            description="This may take a few minutes or a few hours, depending on the amount of data. Thank you for your patience."
            type="info"
            showIcon
          />
        </Card>
      </div>
    );
  } else {
    return children;
  }
};

export default LoadingDashboard;
