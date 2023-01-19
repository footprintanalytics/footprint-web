/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Input, Modal, Skeleton } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { checkTableNameChart, udTableDetail, udTableSaveChartConfig } from "../new-service";
import { useMutation, useQuery } from "react-query";
import { QUERY_OPTIONS } from "../containers/dashboards/shared/config";
import moment from "moment-timezone";
import SaveChartToUdTime from "./SaveChartToUdTime";
import * as Urls from "../lib/urls";
import Link from "metabase/core/components/Link";
import { useDebounce } from "ahooks";
import ChartSchema from "./ChartSchema";
import "./SaveChartToUdModal.css";

const SaveChartToUdModal = ({
  onClose,
  cardId,
  result_metadata,
}) => {
  console.log("result_metadata", result_metadata)
  const [loading, setLoading] = useState(false);
  const [chartConfig, setChartConfig] = useState({});


  const isLoading = false;
  const data = null;
  const refetch = null;

  // const { isLoading, data, refetch } = useQuery(
  //   ["udTableDetail", cardId],
  //   async () => {
  //     return await udTableDetail({ cardId });
  //   },
  //   QUERY_OPTIONS,
  // );
  const [tableName, setTableName] = useState(data?.chartConfig?.targetTableName);
  const debouncedTableName = useDebounce(tableName, { wait: 500 });
  const checkMutate = useMutation(checkTableNameChart);
  const message = checkMutate?.data?.message;

  // useEffect(() => {
  //   if (!debouncedTableName) return;
  //   checkMutate.mutate({ tableName: debouncedTableName, tableType: "chart", cardId: cardId });
  // }, [debouncedTableName]);

  console.log("checkMutate", checkMutate)
  const callbackTime = useCallback(
    (status) => {
      refetch();
    }, [refetch]);

  const targetTableName = chartConfig?.targetTableName;
  const hasSavedToUd = !!chartConfig?.targetTableName;
  console.log("SaveChartToUdModal data", data);
  const onSave = async (data) => {
    const tableName = targetTableName || data.name;
    setLoading(true);
    let result = null;
    // try {
    //   result = await udTableSaveChartConfig({
    //     "cardId": cardId,
    //     "targetTableName": tableName,
    //   });
    // } catch (e) {
    // }
    setTimeout(() => {
      setChartConfig({
        targetTableName: tableName,
        tableId: 10,
        lastUpdatedAt: new Date().getTime()
      })
      setLoading(false);
    }, 5000)
    console.log("result", result);
    // if (result?.result === "success") {
    //   await refetch();
    // }
    // setLoading(false);
  };

  const showSaveCharToUdTime = data?.newestLog?.status === "executing";

  const showMainButton = data?.newestLog?.status !== "executing";

  const firstLoading = isLoading && !data;
  console.log("firstLoading", firstLoading);
  const onCancel = () => {
    onClose && onClose();
  };
  const udTableLink = Urls.newQuestion({ databaseId: 3, tableId: chartConfig?.tableId, limit: 2000 });


  const onChange = value => {
    setTableName(value);
  }
  console.log("checkMutate?.data?.result === 1", checkMutate?.data?.result === 1)

  //data?.chartConfig

  return (
    <Modal
      className="save-chart-to-ud-modal"
      open={true}
      footer={null}
      maskClosable={false}
      title={"Save chart to ud table"}
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
            <ChartSchema result_metadata={result_metadata}/>
            <div className="mb3"/>

            {chartConfig?.targetTableName && (
              <Form.Item name="table" label="Associated UD table name">
                <div className="text-left bg-gray p1">
                  <Link
                    target="_blank"
                    to={udTableLink}
                    onClick={v => {
                      v.preventDefault();
                      if (chartConfig?.tableId) {
                        window.open(udTableLink);
                      }
                    }}>{`ud_${chartConfig?.targetTableName}`}</Link>
                </div>
              </Form.Item>
            )}
            {chartConfig?.lastUpdatedAt && (<Form.Item name="time" label="UD table last updated time">
              <div className="text-left bg-gray p1">
                {moment(chartConfig?.lastUpdatedAt).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </Form.Item>)}
            {/*{data?.newestLog?.status || ""}*/}

            {!hasSavedToUd && (
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
            {message && <Alert message={message} type="warning" showIcon closable />}
            {showSaveCharToUdTime && (<SaveChartToUdTime
                cardId={cardId}
                callback={callbackTime} />
            )}
            {showMainButton && (
              <>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="right"
                  disabled={!debouncedTableName || debouncedTableName?.length === 0}
                  // disabled={!data || checkMutate?.data?.result === 1}
                  loading={loading}
                >
                  {hasSavedToUd ? "Update" : "Submit"}
                </Button>
                {chartConfig?.tableId && (
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
                )}
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
