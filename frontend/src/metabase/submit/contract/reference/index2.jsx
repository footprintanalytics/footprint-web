/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "../index.css";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Radio, Row, Table, Tag } from "antd";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";
import { getRefContractSubmittedList } from "metabase/new-service";
import Link from "metabase/core/components/Link";
import RefContractTable from "metabase/submit/contract/components/RefContractTable";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import ContractAddModel from "../components/ContractAddModel";

const SubmitContract = props => {
  const { user, isAdmin } = props;
  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });

  const { isLoading, data, refetch } = useQuery(
    ["getRefContractSubmittedList"],
    async () => getRefContractSubmittedList(),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      refetchInterval: 10000,
    },
  );

  const renderTable = () => {
    // const tempData = data;
    const tempData = data ?? [];
    if (!tempData || tempData?.length === 0) {
      return (
        <Table size="small" rowKey="_id" dataSource={null} pagination={false} />
      );
    }
    return <RefContractTable data={tempData} />;
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
      <h2 className=" p1">Latest submitted records</h2>
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
      ) : (
        <>{renderTable()}</>
      )}
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
