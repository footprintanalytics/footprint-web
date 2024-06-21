/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "../index.css";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Radio, Row, Table } from "antd";
import { useMutation, useQuery } from "react-query";
import { connect } from "react-redux";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";
import RefContractTable from "metabase/submit/contract/components/RefContractTable";
import { getRefContractSubmittedList, getRefContractSubmittedListByUser, reviewContract } from "metabase/new-service";
import Link from "metabase/core/components/Link";
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

  const recordType = [
    {
      label: "Protocol",
      value: "protocol",
    },
    {
      label: "Contract",
      value: "contract",
    },
  ];
  const [currentRecordType, setCurrentRecordType] = useState(
    recordType[0].value,
  );

  const [isSubmitModalOpen, setSubmitModalOpen] = useState({
    open: false,
    param: null,
  });

  const { isAdmin, user, showAdd = true, headLayout, showActionColumn, tableRowClassName, byUser, showMyContractTitle } = props;
  const isAuditPerson =
    isAdmin || user?.id === 30 || user?.id === 9 || user?.id === 2268; // 30 -> pb, 9 -> alpha in preview ,2268 -> Eason
  const [operator, setOperator] = useState("personal");
  const [status, setStatus] = useState("");
  const [isReviewLoading, setReviewLoading] = useState(false);
  const [ current, setCurrent ] = useState(0)
  const pageSize = 50;
  // const params = {
  //   operator: operator,
  //   status: status === "all" ? "" : status,
  // };

  const params = isAdmin ? { type: currentRecordType }: { type: currentRecordType, email: user?.email, offset: current, limit: pageSize }

  const { isLoading, data, refetch } = useQuery(
    ["getRefContractSubmittedList", params],
    async () => {
      if (byUser) {
        return getRefContractSubmittedListByUser(params)
      }
      return getRefContractSubmittedList(params)
    },
    { refetchOnWindowFocus: false, retry: 0 }
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
      let tempData
      if (byUser) {
        tempData = data?.submit_list ?? [];
      } else {
        tempData = data ?? [];
      }
      if (isLoading) {
        return <LoadingSpinner message="Loading..." />;
      }
      if (!tempData || tempData?.length === 0) {
        return (
          // <Table
          //   size="small"
          //   rowKey="_id"
          //   dataSource={null}
          //   pagination={false}
          //   locale={locale}
          // />
          <div className="flex justify-center" style={{marginTop: 120, fontSize: 24}}>{"No submission records, you can try"}<Link to={"/submit/contract"} className="text-underline text-underline-hover ml1" style={{ color: "#3434b2" }}>submitting your own contract</Link>.</div>
        );
      }
      return (
        <RefContractTable
          data={tempData}
          recordType={currentRecordType}
          showActionColumn={showActionColumn}
          tableRowClassName={tableRowClassName}
          pagination={byUser ? {
            position: [ "bottomCenter" ],
            current: current + 1,
            pageSize,
            total: data?.count,
            showSizeChanger: false,
            onChange: page => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setCurrent(page - 1);
            },
          } : false}
        />
      );
    } else if (operator === "all") {
      return (
        <RefAuditTable
          operator={user?.name}
          type={status}
          recordType={currentRecordType}
        />
      );
    }
  };

  return (
    <div className="SubmitContract">
      {headLayout}
      {showMyContractTitle && (<div>
        <h1>
          My Contracts
        </h1>
      </div>)}
      {showAdd && (<div className="flex flex-col">
        <h1>
          Welcome to submit more contracts or protocols to help us better display
          the data you want
        </h1>
        <span>
          You can resubmit protocols that have been included in Footprint, allowing you to make additions or changes to the information.
          <br/>
          Submissions normally take a few minutes to get processed.
        </span>
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
      </div>
      )}
      <div className="mb2" style={{ float: "right" }}>
        <Radio.Group
          className="ml3"
          options={recordType}
          onChange={e => {
            setCurrentRecordType(e.target.value);
          }}
          value={currentRecordType}
          optionType="button"
          buttonStyle="solid"
        />
        {isAuditPerson && (
          <>
            {operator === "all" && (
              <Radio.Group
                options={statusOptions}
                className="ml3"
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
          </>
        )}
      </div>

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
