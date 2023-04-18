/* eslint-disable react/display-name */
import React from "react";
import dayjs from "dayjs";
import { Button, Switch } from "antd";
import * as Urls from "metabase/lib/urls";
import Link from "metabase/core/components/Link";
import upperFirst from "lodash/upperFirst";

export default ({ router, setTableBelongType, jumpToChart }) => {
  const name = {
    title: "Name",
    key: "name",
    dataIndex: "name",
    render: (value, record) => {
      return (
        <Link
          className="text-underline-hover"
          target="_blank"
          to={
            Urls.newQuestion({
              databaseId: 3,
              tableId: record.tableId,
              type: "query",
            })
          }
        ><h4>{value}</h4></Link>
      );
    },
  };
  const belongType = {
    title: "Type",
    key: "belongType",
    dataIndex: "belongType",
    width: 130,
    render: value => {
      return (
        <div>{upperFirst(value)}</div>
      );
    },
  };
  const source = {
    title: "Source",
    key: "source",
    dataIndex: "source",
    width: 130,
    render: value => {
      return (
        <div>{upperFirst(value)}</div>
      );
    },
  };
  const createdAt = {
    title: "Date",
    key: "createdAt",
    dataIndex: "createdAt",
    width: 150,
    render: value => {
      return (
        <div>{dayjs(value).format("YYYY-MM-DD")}</div>
      );
    },
  };

  const action = {
    title: "Actions",
    key: "action",
    width: 250,
    render: (_, record) => {
      return (
        <div className="flex align-center">
          <Switch checkedChildren="public" unCheckedChildren="private" checked={record.belongType === "public"} onClick={() => setTableBelongType(record)} />
          {/*<Button*/}
          {/*  onClick={() => setTableBelongType(record)}*/}
          {/*>*/}
          {/*  {record.belongType === "public" ? "Private" : "Public"}*/}
          {/*</Button>*/}
          {record.source === "chart" && (
            <Button
              className="ml1"
              onClick={() => jumpToChart(record)}
            >
              {"Chart detail >>"}
            </Button>
          )}
        </div>
      );
    },
  };

  return [name, source, createdAt, action];
};
