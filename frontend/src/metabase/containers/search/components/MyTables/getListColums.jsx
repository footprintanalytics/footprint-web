/* eslint-disable react/display-name */
import React from "react";
import dayjs from "dayjs";
import { Dropdown, Menu } from "antd";
import { getOssUrl } from "metabase/lib/image";
import IconValue from "metabase/containers/dashboards/components/IconValue";
import * as Urls from "metabase/lib/urls";
import Link from "metabase/core/components/Link";

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
        >{value}</Link>
      );
    },
  };
  const belongType = {
    title: "Type",
    key: "belongType",
    dataIndex: "belongType",
    width: 200,
    render: value => {
      return (
        <div>{value}</div>
      );
    },
  };
  const source = {
    title: "Source",
    key: "source",
    dataIndex: "source",
    width: 200,
    render: value => {
      return (
        <div>{value}</div>
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
    title: "",
    key: "action",
    align: "right",
    render: (_, record) => {
      const menu = (<Menu
        onClick={({ key }) => {
          switch (key) {
            case "setPrivate":
              setTableBelongType(record);
              break;
            case "jumpToChart":
              jumpToChart(record);
              break;
          }
        }}
      >
        <Menu.Item key="setPrivate">
          <IconValue iconName="duplicate" value={record.belongType === "public" ? "Set to Private" : "Set to Public"} />
        </Menu.Item>
        {record.source === "chart" && (
          <Menu.Item key="jumpToChart">
            <IconValue iconName="duplicate" value={"Jump to Chart"} />
          </Menu.Item>
        )}
      </Menu>);
      return (
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="dashboards__table-action">
            <img src={getOssUrl("20220309154118.png")} alt="" />
          </div>
        </Dropdown>
      );
    },
  };

  return [name, belongType, source, createdAt, action];
};
