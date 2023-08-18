/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Popover, Table, Tag, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const RefContractTable = ({ data }) => {
  function isWithinMins(createdAt, mins = 30) {
    const halfHourAgo = new Date();
    halfHourAgo.setMinutes(halfHourAgo.getMinutes() - mins);

    const createdAtDate = new Date(createdAt);

    return createdAtDate > halfHourAgo && createdAtDate <= new Date();
  }

  const columns = [
    // {
    //   title: "Type",
    //   width: 200,
    //   dataIndex: "type",
    // },
    {
      title: "Name",
      render: (_, record) => {
        return (
          <>
            <Typography.Text>
              {record?.data?.protocol_name ??
                record?.data?.protocol ??
                record?.data?.protocol_slug}
            </Typography.Text>
            {/* <br />
            <Typography.Text type="secondary">
              {record.contract_address}
            </Typography.Text> */}
          </>
        );
      },
    },
    {
      title: "Website",
      render: (_, record) => {
        return (
          <Typography.Link href={record?.data?.website} target="_blank">
            {record?.data?.website}
          </Typography.Link>
        );
      },
    },
    {
      title: (
        <Tooltip title="Submitted by user.">
          Submitted Contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return record?.data?.contracts?.length > 0 ? (
          <Popover
            content={
              <div style={{ maxHeight: 300, overflow: "auto" }}>
                {record?.data?.contracts?.map((c, index) => {
                  return (
                    <p key={index}>
                      {c.chain}: {c.contractAddress}
                    </p>
                  );
                })}
              </div>
            }
            title="Contracts"
          >
            <Typography.Text>
              {record?.data?.contracts?.length ?? 0} contracts
            </Typography.Text>
          </Popover>
        ) : (
          "-"
        );
      },
    },
    {
      title: (
        <Tooltip title="Detected from the website of this project.">
          Detected Contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return record?.data?.find_contracts?.length > 0 ? (
          <Popover
            content={
              <div style={{ maxHeight: 300, overflow: "auto" }}>
                {record?.data?.find_contracts?.map((c, index) => {
                  return (
                    <p key={index}>
                      {c.protocol_slug}: {c.address}
                    </p>
                  );
                })}
              </div>
            }
            title="Contracts"
          >
            <Typography.Text>
              {record?.data?.find_contracts?.length ?? 0} contracts
            </Typography.Text>
          </Popover>
        ) : isWithinMins(record.createdAt) ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {"detecting"}
          </Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: (
        <Tooltip title="All the contracts of this project.">
          Mapping Contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return record?.data?.mapping_contracts?.length > 0 ? (
          <Popover
            content={
              <div style={{ maxHeight: 300, overflow: "auto" }}>
                {record?.data?.mapping_contracts?.map((c, index) => {
                  return (
                    <p key={index}>
                      {c.chain}: {c.contract_address}
                    </p>
                  );
                })}
              </div>
            }
            title="Contracts"
          >
            <Typography.Text>
              {record?.data?.mapping_contracts?.length >= 500
                ? ">500"
                : record?.data?.mapping_contracts?.length}
              {' '}contracts
            </Typography.Text>
          </Popover>
        ) : isWithinMins(record.createdAt, 60) ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {"mapping"}
          </Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Status",
      render: (_, { status, createdAt }) => {
        const text = status;
        switch (text) {
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "submitted":
            return <Tag color="success">{text}</Tag>;
          default:
            return isWithinMins(createdAt, 120) ? (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {text}
              </Tag>
            ) : (
              <Tag color="warning">{"fail"}</Tag>
            );
        }
      },
    },
    {
      title: "Submitted by",
      // width: 240,
      render: (_, record) => {
        return <Typography.Text>{record?.email}</Typography.Text>;
      },
    },
    {
      title: "Submitted at",
      dataIndex: "createdAt",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="link"
              href={`https://www.footprint.network/@rogerD/Address-Analysis-of-GameFi-Project?protocol_name=${record?.data?.protocol_slug}&date_range=past90days#type=dashboard`}
              target={"_blank"}
            >
              Analytic
            </Button>
            <Button
              type="link"
              href={`https://www.footprint.network/@Bond/Protocol-static-info?protocol_slug=${record?.data?.protocol_slug}`}
              target={"_blank"}
            >
              Detail
            </Button>
            <Button
              type="link"
              href="https://docs.footprint.network/reference/get_protocol-getprotocolcontractlist"
              target={"_blank"}
            >
              Api
            </Button>
          </div>
        );
      },
    },
  ].filter(i => i);

  return (
    <Table
      size="small"
      rowKey="_id"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export default RefContractTable;
