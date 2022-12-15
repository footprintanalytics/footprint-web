/* eslint-disable react/prop-types */
import React from "react";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import * as Urls from "metabase/lib/urls";
import { MetabaseApi } from "metabase/services";
import { formatNativeQuery } from "metabase/lib/engine";
import { getTableNameListFromSQL } from "metabase/lib/formatting";
import { tableSearchV2 } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";

const ToggleCreateType = ({ question, updateQuestion, router }) => {
  const isNative = question.isNative();

  const title = isNative ? "to chart mode" : "to SQL mode";
  const tooltip = `Convert to ${isNative ? "Chart" : "SQL"} Mode`;
  const icon = isNative ? "search_chart" : "sql";

  const toggle = () => {
    Modal.confirm({
      title: `Do you want to convert ${title}?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          if (isNative) {
            await toggleToChart();
          } else {
            await toggleToSQL();
          }
        } catch (error) {
          message.error("Convert failed, please try again");
        }
      },
      onCancel: () => {},
    });
  };

  const toggleToChart = async () => {
    const datasetQuery = question.datasetQuery();
    const { query } = datasetQuery.native;
    const { database: databaseId } = datasetQuery;
    const tableNameList = getTableNameListFromSQL(query);
    console.log("tableNameList", tableNameList)
    if (!tableNameList.length) {
      router.replace(Urls.newQuestion());
      return;
    }

    const tableName = tableNameList[0];
    const search = await tableSearchV2({
      databaseId,
      qs: [tableName],
      project: getProject(),
      queryType: "native",
    });

    const table = search?.list[0]?.tables?.find(f => f.name === tableName);
    const tableId = table?.table_id;
    console.log("tableId", tableId)
    router.replace(Urls.newQuestion({ databaseId, tableId, type: "query" }));
  };

  const toggleToSQL = async () => {
    const datasetQuery = question.datasetQuery();
    const { engine } = question.database();
    const { database } = datasetQuery;

    const native = await MetabaseApi.native(datasetQuery);
    const query = formatNativeQuery(native?.query, engine);

    updateQuestion(
      question
        .setDatasetQuery({ type: "native", native: { query }, database }),
      { shouldUpdateUrl: true },
    )
  };

  return (
    <div className="flex align-center">
      <Tooltip tooltip={tooltip} verticalAttachments={["top", "bottom"]}>
        <Button
          onlyIcon
          iconColor="#ACACB2"
          icon={icon}
          iconSize={16}
          className="ml1 Question-header-btn"
          onClick={toggle}
        />
      </Tooltip>
    </div>
  );
};

export default ToggleCreateType;
