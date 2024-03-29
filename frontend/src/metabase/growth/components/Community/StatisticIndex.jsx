/* eslint-disable react/prop-types */
import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import LoadingConnectorButton from "metabase/growth/components/LoadingConnectorButton";

export const StatisticIndex = props => {
  const { data, isLoading, refetchData, router, project } = props;
  return (
    <Row gutter={[15, 15]} className="w-full mb1">
      {data?.map((option, index) => {
        return (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={option?.title}>
            <Card bordered={false} style={{ minHeight: 140 }}>
              <div className="flex flex-col items-center">
                <LoadingConnectorButton
                  router={router}
                  project={project}
                  className="mt3"
                  disableCheck={
                    option?.value !== null && option?.value >= 0 ? true : false
                  }
                  sourceDefinitionId={option.sourceDefinitionId}
                  refetch={refetchData}
                >
                  <>
                    <Typography.Title
                      level={3}
                      style={{ marginTop: 20, marginBottom: 5 }}
                    >
                      {`${option?.value?.toLocaleString("en-US")}${
                        option?.valueSuffix ? option?.valueSuffix : ""
                      }`}
                    </Typography.Title>
                  </>
                </LoadingConnectorButton>
                <>
                  <Typography.Text>{option?.title}</Typography.Text>
                  {option?.change !== 0 && (
                    <Typography.Text
                      type={`${
                        option?.change < 0
                          ? "danger"
                          : option?.change > 0
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {option?.change > 0 ? (
                        <ArrowUpOutlined />
                      ) : option?.change < 0 ? (
                        <ArrowDownOutlined />
                      ) : null}
                      {Math.abs(option?.change)?.toLocaleString("en-US")}
                    </Typography.Text>
                  )}
                </>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
