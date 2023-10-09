/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "../index.css";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Radio, Row, Table, Tag } from "antd";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";
import RefContractTable from "metabase/submit/contract/components/RefContractTable";
import {
  getContractSubmittedList,
  getRefContractSubmittedList,
  reviewContract,
} from "metabase/new-service";
import Link from "metabase/core/components/Link";
import ContractTable from "metabase/submit/contract/components/ContractTable";
import RefAuditTable from "metabase/submit/contract/components/RefAuditTable";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import ContractAddModel from "../components/ContractAddModel";

const SubmitContract = props => {
  const statusOptions = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "All",
      value: "all",
    },
  ];

  const operatorOptions = [
    {
      label: "Audit",
      value: "all",
    },
    {
      label: "Personal",
      value: "personal",
    },
  ];

  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });

  const { isAdmin, user } = props;
  const isAuditPerson =
    isAdmin || user?.id === 30 || user?.id === 9 || user?.id === 2268; // 30 -> pb, 9 -> alpha in preview ,2268 -> Eason
  const [operator, setOperator] = useState("personal");
  const [status, setStatus] = useState("");
  const [isReviewLoading, setReviewLoading] = useState(false);
  // const params = {
  //   operator: operator,
  //   status: status === "all" ? "" : status,
  // };

  const { isLoading, data, refetch } = useQuery(
    ["getRefContractSubmittedList"],
    async () => getRefContractSubmittedList(),
    { refetchOnWindowFocus: false, retry: 0 },
  );

  const reviewMutate = useMutation(reviewContract);

  useEffect(() => {
    if (operator === "all") {
      setStatus("pending");
    } else {
      setStatus("");
    }
  }, [operator]);

  const renderTable = () => {
    if (operator === "personal") {
      const tempData = data ?? [];
      if (isLoading) {
        return <LoadingSpinner message="Loading..." />;
      }
      if (!tempData || tempData?.length === 0) {
        return (
          <Table
            size="small"
            rowKey="_id"
            dataSource={null}
            pagination={false}
          />
        );
      }
      return <RefContractTable data={tempData} />;
    } else if (operator === "all") {
      return <RefAuditTable operator={user?.name} type={status} />;
    }
  };

  return (
    <div className="SubmitContract">
      <h1>
        Welcome to submit more contracts or protocols to help us better display
        the data you want
      </h1>
      <span>Submissions normally take a few minutes to get processed.</span>
      <p>
        {"If you have any questions, please "}
        <Link
          className="text-underline text-underline-hover text-brand"
          to="https://docs.footprint.network/docs/smart-contracts-decoding"
          target="_blank"
        >
          check out the tutorial
        </Link>
        .
      </p>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  setSubmitModalOpen({ open: true, param: null });
                }}
              >
                Add contract or protocol
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {isAuditPerson && (
        <div className="mb1" style={{ float: "right" }}>
          {operator === "all" && (
            <Radio.Group
              options={statusOptions}
              onChange={e => {
                setStatus(e.target.value);
              }}
              value={status}
              optionType="button"
              buttonStyle="solid"
            />
          )}
          <Radio.Group
            className="ml3"
            options={operatorOptions}
            onChange={e => {
              setOperator(e.target.value);
            }}
            value={operator}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      )}
      {renderTable()}
      {isSubmitModalOpen?.open && (
        <ContractAddModel
          user={user}
          open={isSubmitModalOpen?.open}
          onClosed={() => {
            setSubmitModalOpen({ open: false, param: null });
            // refresh data after add contract
            refetch();
          }}
        ></ContractAddModel>
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isAdmin: getUserIsAdmin(state, props),
  user: getUser(state),
});

export default connect(mapStateToProps)(SubmitContract);
