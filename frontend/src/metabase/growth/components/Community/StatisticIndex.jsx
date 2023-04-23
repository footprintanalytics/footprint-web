/* eslint-disable react/prop-types */
import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import LoadingConnectorButton from "metabase/growth/components/LoadingConnectorButton";

export const StatisticIndex = props => {
  const { data, isLoading, refetchData, router, project } = props;
  return (
    <Row gutter={[15, 15]} className="w-full ">
      {data?.map((option, index) => {
        return (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={option?.title}>
            <Card bordered={false} style={{ minHeight: 140 }}>
              <div className="flex flex-col items-center">
                <Typography.Text>{option?.title}</Typography.Text>
                <LoadingConnectorButton
                  router={router}
                  project={project}
                  metrics={option?.metrics}
                  className="mt1"
                  disableCheck={
                    option?.value !== null && option?.value >= 0 ? true : false
                  }
                  fgaConnectorId={option.fgaConnectorId}
                  refetch={refetchData}
                >
                  <>
                    <Typography.Title
                      level={3}
                      style={{ marginTop: 10, marginBottom: 5 }}
                    >
                      {option?.value?.toLocaleString("en-US")}
                    </Typography.Title>
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
                </LoadingConnectorButton>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
