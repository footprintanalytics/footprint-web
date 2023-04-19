/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Card, Typography, Button } from "antd";
import cx from "classnames";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";

const LoadingConnectorButton = ({
  fgaConnectorId,
  metrics,
  router,
  project,
  children,
  disableCheck,
  className,
  refetch,
}) => {
  const { data } = useQuery(
    ["GetFgaConnectorJob", project?.id, fgaConnectorId],
    async () => GetFgaConnectorJob({ projectId: project?.id, fgaConnectorId }),
    {
      refetchInterval: data =>
        data?.[metrics]?.status === "succeeded" ||
        data?.[metrics]?.status === "failed"
          ? false
          : 10000,
      enabled: !!fgaConnectorId && !!metrics && !disableCheck,
    },
  );
  if (disableCheck) {
    return children;
  }
  if (!fgaConnectorId || !metrics) {
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
        Set up now
      </Button>
    );
  } else if (fgaConnectorId && data?.[metrics]?.status === "failed") {
    return (
      <>
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
          Edit Now
        </Button>
        <Typography.Text type="danger" className="mt1">
          Connector job exce fail.
        </Typography.Text>
      </>
    );
  } else if (
    fgaConnectorId &&
    data?.[metrics]?.status !== "succeeded" &&
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
    data?.[metrics]?.status === "succeeded" && refetch?.();
    return children;
  }
};

export default LoadingConnectorButton;
