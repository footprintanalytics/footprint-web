/* eslint-disable react/prop-types */
import React from "react";
import { Card, Col, Row, Typography } from "antd";

export const StatisticIndex = props => {
  const { data, isLoading, refetchData } = props;
  return (
    <Row gutter={16} className="w-full ">
      {data?.map((option, index) => {
        return (
          <Col span={4} key={option.title}>
            <Card bordered={false}>
              <div className="flex flex-col items-center">
                <Typography.Text>{option.title}</Typography.Text>
                <Typography.Title
                  level={3}
                  style={{ marginTop: 10, marginBottom: 5 }}
                >
                  {option.value}
                </Typography.Title>
                <Typography.Text
                  type={`${
                    option.change < 0
                      ? "danger"
                      : option.change > 0
                      ? "success"
                      : "secondary"
                  }`}
                >
                  {`${option.change > 0 ? "+" : ""}`}
                  {option.change}
                </Typography.Text>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};;
