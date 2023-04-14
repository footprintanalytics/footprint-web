/* eslint-disable react/prop-types */
import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import LoadingConnectorButton from "metabase/growth/components/LoadingConnectorButton";

export const StatisticIndex = props => {
  const { data, isLoading, refetchData, router, project } = props;
  return (
    <Row gutter={16} className="w-full ">
      {data?.map((option, index) => {
        return (
          <Col span={4} key={option?.title}>
            <Card bordered={false} style={{ minHeight: 140 }}>
              <div className="flex flex-col items-center">
                <Typography.Text>{option?.title}</Typography.Text>
                <LoadingConnectorButton
                  router={router}
                  project={project}
                  className="mt2"
                  disableCheck={option?.value ? true : false}
                  sourceDefinitionId={option.sourceDefinitionId}
                  refetch={option.refetch}
                >
                  <>
                    <Typography.Title
                      level={3}
                      style={{ marginTop: 10, marginBottom: 5 }}
                    >
                      {option?.value?.toLocaleString("en-US")}
                    </Typography.Title>
                    <Typography.Text
                      type={`${
                        option?.change < 0
                          ? "danger"
                          : option?.change > 0
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {`${option?.change > 0 ? "+" : ""}`}
                      {option?.change?.toLocaleString("en-US")}
                    </Typography.Text>
                  </>
                </LoadingConnectorButton>
                {/* {option?.value ? (
                  <>
                    <Typography.Title
                      level={3}
                      style={{ marginTop: 10, marginBottom: 5 }}
                    >
                      {option?.value?.toLocaleString("en-US")}
                    </Typography.Title>
                    <Typography.Text
                      type={`${
                        option?.change < 0
                          ? "danger"
                          : option?.change > 0
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {`${option?.change > 0 ? "+" : ""}`}
                      {option?.change?.toLocaleString("en-US")}
                    </Typography.Text>
                  </>
                ) : (

                  <Button
                    type="primary"
                    className="mt2 rounded"
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
                )} */}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};;
