/* eslint-disable curly */
/* eslint-disable react/prop-types */
import { getOssUrl } from "metabase/lib/image";
import React, { useState } from "react";
import "./index.css";
import { Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { SyncOutlined } from "@ant-design/icons";

const Table = ({
  prepareData,
  hideVerify = false,
  canEdit = false,
  onPrepareDataChange,
}) => {
  const { tableSchema, tablePartData, bigquerySchemaType } = prepareData;
  const [showTooltip, setShowTooltip] = useState(true);

  let rawPrepareData = localStorage.getItem("rawPrepareData");
  rawPrepareData && (rawPrepareData = JSON.parse(rawPrepareData));

  const onSchemaChange = (value, item) => {
    const newTableSchema = [...tableSchema];
    newTableSchema.forEach(nts => {
      if (nts.name === item.name) nts.type = value;
    });

    const newTablePartData = [...tablePartData];
    const index = newTablePartData[0].findIndex(ntpd => {
      return ntpd === item.name;
    });
    newTablePartData.forEach((ntpd, i) => {
      if (i === 0) return;
      const raw = rawPrepareData.tablePartData[i][index];
      switch (value) {
        case "NUMBER":
          ntpd[index] = parseFloat(raw);
          break;
        case "TEXT":
          ntpd[index] = String(raw);
          break;
        case "DATE":
          ntpd[index] = dayjs(raw).format("YYYY-MM-DD HH:mm:ss");
          break;
        default:
          break;
      }
    });

    onPrepareDataChange({
      ...prepareData,
      tableSchema: newTableSchema,
      tablePartData: newTablePartData,
    });
  };

  return (
    <div className="custom-upload__table">
      {canEdit && (
        <div
          className="custom-upload__table-reset"
          onClick={() => {
            onPrepareDataChange({
              ...prepareData,
              tableSchema: rawPrepareData.tableSchema,
              tablePartData: rawPrepareData.tablePartData,
            });
          }}
        >
          <SyncOutlined />
          Reset
        </div>
      )}
      <table>
        <thead>
          <tr>
            {tableSchema.map(ts => (
              <td key={ts.name}>{ts.name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {canEdit && (
            <tr>
              {tableSchema.map((ts, ti) => (
                <td key={ts.name} className="custom-upload__table--edit-td">
                  <Tooltip
                    placement="bottom"
                    title="Select the column type"
                    visible={ti === 0 && showTooltip}
                  >
                    <Select
                      value={ts.type}
                      className="custom-upload__table-select"
                      onChange={value => onSchemaChange(value, ts)}
                      onClick={() => setShowTooltip(false)}
                    >
                      {Object.values(bigquerySchemaType).map(bst => (
                        <Select.Option key={bst} value={bst}>
                          {bst}
                        </Select.Option>
                      ))}
                    </Select>
                  </Tooltip>
                </td>
              ))}
            </tr>
          )}
          {tablePartData.slice(1, 6).map((tpd, i) => (
            <tr key={JSON.stringify(tpd) + i}>
              {tpd.map((item, j) => (
                <td key={item + j}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!hideVerify && (
        <img src={getOssUrl("20220221171657.png")} alt="verify" />
      )}
    </div>
  );
};

export default Table;
