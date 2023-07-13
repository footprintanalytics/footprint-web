/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, message, Modal, Popover, Select, Skeleton } from "antd";
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
import { trackStructEvent } from "../lib/analytics";
import TableBelong from "../containers/customUpload/components/Confirm/TableBelong";
import { capitalize, get } from "lodash";
import Icon from "./Icon";

const SaveChartToUdModal = ({
  onClose,
  cardId,
  result_metadata,
  creatorId,
  user,
  enableSave = true,
  setNeedPermissionModal,
}) => {
  const [form] = Form.useForm();
  const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
  const [loading, setLoading] = useState(false);

  const { isLoading, data, refetch } = useQuery(
    ["udTableDetail", cardId],
    async () => {
      return await udTableDetail({ cardId });
    },
    QUERY_OPTIONS,
  );

  const chartConfig = data?.chartConfig;
  const crons = data?.crons;
  const chartCronLabel = get(crons, '[0].cronLabel');
  const [cronLabel, setCronLabel] = useState(chartCronLabel);
  const [tableName, setTableName] = useState(data?.chartConfig?.targetTableName);
  const debouncedTableName = useDebounce(tableName, { wait: 500 });
  const checkMutate = useMutation(checkTableNameChart);
  const checkNameMessage = checkMutate?.data?.message;
  const isOwner = user && (user.id === creatorId);
  const [belongType, setBelongType] = useState(data?.belongType);

  useEffect(() => {
    setBelongType(data?.belongType || "public");
  }, [data?.belongType]);

  useEffect(() => {
    const cron = get(crons, '[0].cronLabel') || "never"
    setCronLabel(cron);
    form?.setFieldsValue({
      cron: cron,
    });
  }, [crons]);

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
    trackStructEvent("SaveChartToUdModal onSave")
    if (!enableSave) {
      message.info("Do not support sql with parameters, please remove the parameters")
      return ;
    }
    if (!isPaidUser && belongType === "private") {
      onCancel();
      setNeedPermissionModal("Upgrade to the Business Plan to protect your data privacy");
      return ;
    }
    if (!isPaidUser && data?.cron !== "daily" && data?.cron) {
      onCancel();
      setNeedPermissionModal("Upgrade to the Business Plan to change updating frequency");
      return ;
    }
    const cronsObject = {crons: [{identifier: 1, cronLabel: data?.cron || "daily" }]};
    const tableName = targetTableName || data.name;
    setLoading(true);
    let result = null;
    try {
      result = await udTableSaveModelConfig({
        "source": "chartTrino",
        "sourceId": cardId,
        "targetTableName": tableName,
        "belongType": belongType,
        ...cronsObject,
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

  const getCronMappingTint = (chartCronLabel) => {
    const data = {
      "daily": "Run the task daily at 12:00 PM UTC",
      "every 12 hours": "Run the task twice daily at 12:00 AM and 12:00 PM UTC",
      "every 8 hours": "Run the task three times daily at 12:00 AM, 8:00 AM, and 4:00 PM UTC",
      "every 4 hours": "Run the task six times daily at 12:00 AM, 4:00 AM, 8:00 AM, 12:00 PM, 4:00 PM and 8:00 PM UTC",
    }
    return data[chartCronLabel] || "Never run the update task"
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
          form={form}
          layout="vertical"
          name="control-ref"
          onFinish={onSave}
        >
          <div className="text-centered flex flex-column">
            <div className="save-chart-to-ud-modal__desc">You can save the data of this chart to the UD table. The UD table will run with the latest data every day and use an intermediate table to handle computationally intensive situations.</div>
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
                          trackStructEvent("SaveChartToUdModal open table")
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
              {chartConfig?.targetTableName && (
                <div className="ud-chart__form-item ml2">
                  <div>Update frequency</div>
                  <h3 className="text-left bg-gray">
                    {capitalize(chartCronLabel) || "Never"}
                    <Popover className="cursor-pointer" content={getCronMappingTint(chartCronLabel)} >
                      <Icon name="info_outline" className="mx1" />
                    </Popover>
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
              <div className="flex flex-column">
                <Card title="Setting">
                  <Form.Item
                    wrapperCol={{ span: 6 }}
                    name="cron"
                    label="Update frequency"
                  >
                    <Select
                      defaultValue={cronLabel}
                      value={cronLabel}
                      onChange={value => setCronLabel(value)}
                      style={{ width: 160 }}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'every 12 hours', label: 'Every 12 hours' },
                        { value: 'every 8 hours', label: 'Every 8 hours' },
                        { value: 'every 4 hours', label: 'Every 4 hours' },
                        { value: 'never', label: 'Never' },
                      ]}
                    />
                  </Form.Item>
                  <div className="text-left">
                    <TableBelong
                      belongType={belongType}
                      setBelongType={setBelongType} />
                  </div>
                </Card>
                <div className="flex mt2 justify-center">
                  <Button
                    style={{
                      "width": 200
                    }}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    disabled={!data || (!hasSavedToUd && !debouncedTableName) || checkMutate.isLoading || checkMutate?.data?.result === 1}
                    loading={loading}
                  >
                    {checkMutate.isLoading ? "Checking..." : (hasSavedToUd ? "Update" : "Save")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>
      )}
    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(SaveChartToUdModal);
