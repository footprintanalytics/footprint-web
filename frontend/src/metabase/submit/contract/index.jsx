/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "./index.css";
import React from "react";
import { Table, Form, Row, Col, Button, Typography, Tag } from "antd";
import { useQuery } from "react-query";
import { getContractSubmittedList } from "metabase/new-service";
import Link from "metabase/core/components/Link";
import ContractTable from "metabase/submit/contract/components/ContractTable";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";

const SubmitContract = props => {
  const { isLoading, data } = useQuery(
    ["getContractSubmittedList"],
    async () => getContractSubmittedList(),
    { refetchOnWindowFocus: false, retry: 0 },
  );
  console.log("data", data)
  return (
    <div className="SubmitContract">
      <h1>
        Welcome to submit more contracts to help us better display the data you
        want
      </h1>
      <span>Contract submissions normally take a few days to get processed.</span>
      <p>{"If you have any questions, please "}
        <Link
          className="text-underline text-underline-hover text-brand"
          to="https://docs.footprint.network/docs/smart-contracts-decoding"
          target="_blank"
        >
          check out the tutorial
        </Link>.
      </p>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  props.router.push("/submit/contract/add");
                }}
              >
                Add contract
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {isLoading?
        (<LoadingSpinner message="Loading..." />)
        :
        data?.map(item => {
          return (
            <div key={item.protocol_name} className="pt2">
              <h3 className="my2">{item.protocol_name}</h3>
              <ContractTable data={item.submit_list}/>
            </div>
          )
        })
      }
    </div>
  );
};

export default SubmitContract;
