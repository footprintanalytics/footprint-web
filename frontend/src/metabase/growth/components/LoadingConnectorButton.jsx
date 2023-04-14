/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Card, Typography, Button } from "antd";
import cx from "classnames";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";

const LoadingConnectorButton = ({
  sourceDefinitionId,
  router,
  project,
  children,
  disableCheck,
  className,
  refetch,
}) => {
  const { data } = useQuery(
    ["GetFgaConnectorJob", project?.id, sourceDefinitionId],
    async () =>
      GetFgaConnectorJob({ projectId: project?.id, sourceDefinitionId }),
    {
      refetchInterval: data => (data?.status === "succeeded" ? false : 10000),
      enabled: !!sourceDefinitionId,
    },
  );
  if (disableCheck) {
    return children;
  }
  if (!sourceDefinitionId) {
    return (
      <Button
        type="primary"
        className={cx("rounded", className)}
        // size="small"
        onClick={() => {
          router?.push({
            pathname: getGrowthProjectPath(
              router?.params?.project,
              "Connector",
            ),
          });
        }}
      >
        Setting Now
      </Button>
    );
  } else if (
    sourceDefinitionId &&
    data?.status !== "succeeded" &&
    project.twitter_handler !== "Footprint_Data"
  ) {
    return (
      <Button
        type="primary"
        className={cx("rounded", className)}
        disabled={true}
        loading={true}
        // size="small"
        onClick={() => {
          router?.push({
            pathname: getGrowthProjectPath(
              router?.params?.project,
              "Connector",
            ),
          });
        }}
      >
        Loading...
      </Button>
    );
  } else {
    refetch?.();
    return children;
  }
};

export default LoadingConnectorButton;
