/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Input, message, Modal, Skeleton, Card, Popover } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { checkTableNameChart, udTableDetail, udTableSaveModelConfig } from "../new-service";
import { useMutation, useQuery } from "react-query";
import { QUERY_OPTIONS } from "../containers/dashboards/shared/config";
import moment from "moment-timezone";
import SaveChartToUdTime from "./SaveChartToUdTime";
import SaveChartToUdFail from "./SaveChartToUdFail";
import * as Urls from "../lib/urls";
import Link from "metabase/core/components/Link";
import { useDebounce } from "ahooks";
import ChartSchema from "./ChartSchema";
import "./SaveChartToUdModal.css";
import Code from "../containers/buffet/components/Code";

const SaveChartToUdModal = ({
  onClose,
  cardId,
  result_metadata,
  creatorId,
  user,
  enableSave = true,
}) => {
  const [loading, setLoading] = useState(false);

  const { isLoading, data, refetch } = useQuery(
    ["udTableDetail", cardId],
    async () => {
      return await udTableDetail({ cardId });
    },
    QUERY_OPTIONS,
  );

  const chartConfig = data?.chartConfig;
  const [tableName, setTableName] = useState(data?.chartConfig?.targetTableName);
  const debouncedTableName = useDebounce(tableName, { wait: 500 });
  const checkMutate = useMutation(checkTableNameChart);
  const checkNameMessage = checkMutate?.data?.message;
  const isOwner = user && (user.id === creatorId);

  const callbackTime = useCallback(
    ({ status, tableName, successCount }) => {
      if (status === "done") {
        const action = successCount === 1 ? "save": "update";
        message.success(`${tableName} ${action} successfully.`);
      } else if (status === "fail") {
        const action = successCount === 0 ? "save": "update";
        message.error(`${tableName} ${action} fail.`);
      }
      refetch();
    }, [refetch]);

  const targetTableName = chartConfig?.targetTableName;
  const hasSavedToUd = !!chartConfig?.targetTableName;
  useEffect(() => {
    if (!debouncedTableName || hasSavedToUd) return;
    checkMutate.mutate({ tableName: debouncedTableName, tableType: "chart", cardId: cardId });
  }, [debouncedTableName, hasSavedToUd]);
  const onSave = async (data) => {
    if (!enableSave) {
      message.info("Do not support sql with parameters, please remove the parameters")
      return ;
    }
    const tableName = targetTableName || data.name;
    setLoading(true);
    let result = null;
    try {
      result = await udTableSaveModelConfig({
        "source": "chartTrino",
        "sourceId": cardId,
        "targetTableName": tableName,
      });
    } catch (e) {
    }
    if (result?.result === "success") {
      await refetch();
    }
    setLoading(false);
  };

  const showSaveCharToUdTime = data?.newestLog?.status === "executing";
  const showFailStatus = data?.newestLog?.status === "fail";

  const showMainButton = data?.newestLog?.status !== "executing" && isOwner;

  const firstLoading = isLoading && !data;
  const onCancel = () => {
    onClose && onClose();
  };
  const udTableLink = Urls.newQuestion({ databaseId: 3, tableId: chartConfig?.tableId, limit: 2000 });


  const onChange = value => {
    setTableName(value);
  }

  return (
    <Modal
      className="save-chart-to-ud-modal"
      open={true}
      footer={null}
      maskClosable={false}
      title={"Save chart to UD table"}
      onCancel={onCancel}
    >
      {firstLoading ? (
        <Skeleton active />
      ) : (
        <Form
          layout="vertical"
          name="control-ref"
          onFinish={onSave}
        >
          <div className="text-centered flex flex-column">
            <div className="save-chart-to-ud-modal__desc">You can save the data of this chart to the ud table. ud table will run the latest data once a day at 12:00 utc, and use the intermediate table to solve the case of large computation.</div>
            <Card title="UD table info">
            <div className="flex">
              {chartConfig?.targetTableName && (
                <div className="ud-chart__form-item">
                  <span>Associated UD table name</span>
                  <div className="text-left bg-gray">
                    <Link
                      target="_blank"
                      to={chartConfig?.lastUpdatedAt ? udTableLink : ""}
                      onClick={v => {
                        v.preventDefault();
                        if (chartConfig?.tableId && chartConfig?.lastUpdatedAt) {
                          window.open(udTableLink);
                        }
                      }}>
                      <h3 className="cursor-pointer text-underline-hover">{`ud_${chartConfig?.targetTableName}`}</h3>
                    </Link>
                  </div>
                </div>
              )}
              {chartConfig?.lastUpdatedAt && (
                <div className="ud-chart__form-item ml2">
                  <div>UD table last updated time</div>
                  <h3 className="text-left bg-gray">
                    {moment(chartConfig?.lastUpdatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </h3>
                </div>
              )}
              {data?.newestLog?.sql && (
                <Popover className="ml4 cursor-pointer" content={<Code value={data?.newestLog?.sql} marginTop={0}/>} title="SQL" overlayStyle={{ width: 600, maxHeight: 300, padding: "12px 0" }}>
                  <div>SQL</div>
                </Popover>
              )}
            </div>
            {/*{data?.newestLog?.status || ""}*/}

            {!hasSavedToUd && isOwner && (
              <Form.Item name="name" label="Which table name do you save?">
                <Input
                  prefix="ud_"
                  size="large"
                  value={tableName}
                  onChange={e => onChange(e.target.value)}
                  placeholder="table name"
                  allowClear
                />
              </Form.Item>
            )}
            {checkNameMessage && <Alert message={checkNameMessage} type="warning" showIcon closable />}
            </Card>
            <div className="mb3"/>
            <Card title="Schema">
              <ChartSchema result_metadata={result_metadata}/>
            </Card>
            <div className="mb3"/>

            {showSaveCharToUdTime && (<SaveChartToUdTime
                cardId={cardId}
                callback={callbackTime} />
            )}

            {showFailStatus && (
              <SaveChartToUdFail />
            )}

            {showMainButton && (
              <>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="right"
                  disabled={!data || (!hasSavedToUd && !debouncedTableName) || checkMutate.isLoading || checkMutate?.data?.result === 1}
                  loading={loading}
                >
                  {checkMutate.isLoading ? "Checking..." : (hasSavedToUd ? "Update" : "Save")}
                </Button>
               {/* {chartConfig?.tableId && (
                  <Link
                    className="mt2"
                    target="_blank"
                    to={udTableLink}
                    onClick={v => {
                      v.preventDefault();
                      if (chartConfig?.tableId) {
                        window.open(udTableLink);
                      }
                    }}>
                    To create chart
                  </Link>
                )}*/}
              </>
            )}
          </div>
        </Form>
      )
      }

    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(SaveChartToUdModal);
