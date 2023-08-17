/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Popover, Table, Tag, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined,SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const RefContractTable = ({ data }) => {

  function isWithinHalfHour(createdAt) {
    const halfHourAgo = new Date();
    halfHourAgo.setMinutes(halfHourAgo.getMinutes() - 30);

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
        return <Typography.Link>{record?.data?.website}</Typography.Link>;
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
              <div style={{maxHeight:300,overflow:'auto'}}>
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
              <div  style={{maxHeight:300,overflow:'auto'}}>
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
        ) : (
          isWithinHalfHour(record.createdAt)?<Tag icon={<SyncOutlined spin />} color="processing">{'detecting'}</Tag>:'-'
        );
      },
    },
    // {
    //   title: (
    //     <Tooltip title="Finally adopted and stored in the database..">
    //       Adopted contracts <QuestionCircleOutlined />
    //     </Tooltip>
    //   ),
    //   render: (_, record) => {
    //     return (
    //       <Typography.Text>
    //         Total: {record?.data?.adopted_contracts?.length ?? 0}
    //       </Typography.Text>
    //     );
    //   },
    // },
    {
      title: "Status",
      width: 120,
      dataIndex: "status",
      render: text => {
        switch (text) {
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "submitted":
            return <Tag color="success">{text}</Tag>;
          default:
            return <Tag icon={<SyncOutlined spin />} color="processing">{text}</Tag>;
        }
      },
    },
    {
      title: "Submitted by",
      width: 240,
      render: (_, record) => {
        return <Typography.Text>{record?.email}</Typography.Text>;
      },
    },
    {
      title: "Submitted at",
      width: 150,
      dataIndex: "createdAt",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
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
