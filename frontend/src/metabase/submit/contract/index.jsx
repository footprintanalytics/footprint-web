/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Radio, Row, Table, Tag } from "antd";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";
import { getContractSubmittedList, reviewContract } from "metabase/new-service";
import Link from "metabase/core/components/Link";
import ContractTable from "metabase/submit/contract/components/ContractTable";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";

const SubmitContract = props => {

  const statusOptions = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "All",
      value: "all",
    }]

  const operatorOptions = [
    {
      label: "Audit",
      value: "all",
    },
    {
      label: "Personal",
      value: "",
    }]

  const { isAdmin, user } = props;
  const isAuditPerson = isAdmin;
  const [operator, setOperator] = useState("");
  const [status, setStatus] = useState("");
  const [isReviewLoading, setReviewLoading] = useState(false);
  const params = {
    operator: operator,
    status: status === "all" ? "": status,
  }

  const { isLoading, data, refetch } = useQuery(
    ["getContractSubmittedList", params],
    async () => getContractSubmittedList(params),
    { refetchOnWindowFocus: false, retry: 0 },
  );

  const reviewMutate = useMutation(reviewContract);

  /*const filterPending = (data) => {
    const pendingData = data?.map(item => {
      return {
        ...item,
        submit_list: item.submit_list.filter(s => s.status === "pending")
      }
    })
    return pendingData?.filter(p => p.submit_list.length > 0);
  }*/

  useEffect(() => {
    if (operator === "all") {
      setStatus("pending")
    }
  }, [operator])

  const renderTable = () => {
    const tempData = data;
    if (isLoading) {
      return (<LoadingSpinner message="Loading..." />)
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

    return tempData?.map(item => {
      const isNew = item.submit_list[0].is_new_protocol;
      return (
        <div key={item.protocol_name} className="pt2">
          <div className="flex align-center">
            <h3 className="my2">{item.protocol_name}</h3>
            {isNew && (<div className="ml2"><Tag color="#108ee9">New</Tag></div>)}
          </div>
          <ContractTable
            data={item.submit_list}
            isReviewLoading={isReviewLoading}
            showAction={operator === "all"}
            onReviewAction={async (record, status) => {
              const params = {
                "contractAddress": record.contract_address,
                "id": record._id,
                "status": status, // reject & approved
                "operator": user?.name,
              };
              try {
                setReviewLoading(true);
                await reviewMutate.mutateAsync(params)
                await refetch()
                setReviewLoading(false);
              } catch (error) {
                console.log(error)
              }
            }}
          />
        </div>
      )
    })
  }

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
      {isAuditPerson && (
        <div
          className="mb1"
          style={{ float: "right" }}
        >
          {operator === "all" && (
            <Radio.Group
              options={statusOptions}
              onChange={e => {
                setStatus(e.target.value)
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
              setOperator(e.target.value)
            }}
            value={operator}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      )}
      {renderTable()}
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isAdmin: getUserIsAdmin(state, props),
  user: getUser(state),
});

export default connect(mapStateToProps)(SubmitContract);
