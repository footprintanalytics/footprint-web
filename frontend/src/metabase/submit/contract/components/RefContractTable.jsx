/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Popover, Space, Table, Tag, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const RefContractTable = ({ data, recordType, showActionColumn = true, tableRowClassName, pagination = false }) => {
  function isWithinMins(createdAt, mins = 30) {
    const halfHourAgo = new Date();
    halfHourAgo.setMinutes(halfHourAgo.getMinutes() - mins);

    const createdAtDate = new Date(createdAt);

    return createdAtDate > halfHourAgo && createdAtDate <= new Date();
  }

  const protocolColumns = [
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
              {record?.data?.contracts?.length ?? 0}
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
              {record?.data?.find_contracts?.length ?? 0}
            </Typography.Text>
          </Popover>
        ) : isWithinMins(record.createdAt) && record.status !== "rejected" ? (
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
                ? "> 500"
                : record?.data?.mapping_contracts?.length}
            </Typography.Text>
          </Popover>
        ) : isWithinMins(record.createdAt, 60) &&
          record.status !== "rejected" ? (
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
      render: (_, { status, createdAt, error }) => {
        const text = status;
        switch (text) {
          case "reviewing":
            return <Tag color="processing">{text}</Tag>;
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "submitted":
          case "approved":
            return (
              <Tooltip title={error}>
                <Tag color="success">{text}</Tag>
              </Tooltip>
            );
          case "rejected":
            return (
              <Tooltip title={error}>
                <Tag color="error">{text}</Tag>
              </Tooltip>
            );
          default:
            return isWithinMins(createdAt, 120) ? (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {text}
              </Tag>
            ) : (
              <Tooltip title={error}>
                {" "}
                <Tag color="warning">{"fail"}</Tag>
              </Tooltip>
            );
        }
      },
    },
    {
      title: "Decode Status",
      render: (_, { decode_status, createdAt, error }) => {
        const text = decode_status;
        switch (text) {
          case "holding":
          case "pending":
          case "decoding":
            return <Tag color="processing">{text}</Tag>;
          case "decoded_failed":
            return <Tag color="error">{text}</Tag>;
          case "decoded_completed":
            return (
              <Tag color="success">{text}</Tag>
            );
          default:
            return (
              <>{" "}</>
            );
        }
      },
    },
    {
      title: "Submitted by",
      // width: 240,
      render: (_, record) => {
        if (record?.username === "") {
          record.username = null;
        }
        if (record?.email === "") {
          record.email = null;
        }
        return (
          <Typography.Text>
            {record?.username ?? record?.email ?? "-"}
          </Typography.Text>
        );
      },
    },
    {
      title: "Submitted at",
      dataIndex: "createdAt",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
    showActionColumn ? {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="link"
              href={`https://www.footprint.network/@rogerD/Address-Analysis-of-GameFi-Project?protocol_name=${record?.data?.protocol_slug}&date_range=past90days#type=dashboard`}
              target={"_blank"}
            >
              Analytics
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
              API
            </Button>
          </div>
        );
      },
    } : null,
  ].filter(i => i);
  const contractColumns = [
    {
      title: "Chain",
      render: (_, record) => {
        return (
          <>
            <Typography.Text>{record?.data?.chain}</Typography.Text>
          </>
        );
      },
    },
    {
      title: "Contract",
      render: (_, record) => {
        return (
          <div className=" flex flex-col w-full">
            <Typography.Text>{record?.data?.contract_name}</Typography.Text>
            <Typography.Text type="secondary">
              {record?.data?.contract_address}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Protocol Name",
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
      title: "Standard",
      render: (_, record) => {
        return <Tag>{record?.data?.standard}</Tag>;
      },
    },

    {
      title: "ABI",
      width: 300,
      render: (_, record) => {
        return (
          <Typography.Paragraph
            ellipsis={{ tooltip: true, rows: 4, expandable: false }}
          >
            <code>{JSON.stringify(record?.data?.abi)}</code>
          </Typography.Paragraph>
        );
      },
    },

    // {
    //   title: (
    //     <Tooltip title="Detected from the website of this project.">
    //       Detected Contracts <QuestionCircleOutlined />
    //     </Tooltip>
    //   ),
    //   render: (_, record) => {
    //     return record?.data?.find_contracts?.length > 0 ? (
    //       <Popover
    //         content={
    //           <div style={{ maxHeight: 300, overflow: "auto" }}>
    //             {record?.data?.find_contracts?.map((c, index) => {
    //               return (
    //                 <p key={index}>
    //                   {c.protocol_slug}: {c.address}
    //                 </p>
    //               );
    //             })}
    //           </div>
    //         }
    //         title="Contracts"
    //       >
    //         <Typography.Text>
    //           {record?.data?.find_contracts?.length ?? 0}
    //         </Typography.Text>
    //       </Popover>
    //     ) : isWithinMins(record.createdAt) && record.status !== "rejected" ? (
    //       <Tag icon={<SyncOutlined spin />} color="processing">
    //         {"detecting"}
    //       </Tag>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
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
                ? "> 500"
                : record?.data?.mapping_contracts?.length}
            </Typography.Text>
          </Popover>
        ) : isWithinMins(record.createdAt, 60) &&
          record.status !== "rejected" ? (
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
      render: (_, { status, createdAt, error }) => {
        const text = status;
        switch (text) {
          case "reviewing":
            return <Tag color="processing">{text}</Tag>;
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "submitted":
          case "approved":
            return (
              <Tooltip title={error}>
                <Tag color="success">{text}</Tag>
              </Tooltip>
            );
          case "rejected":
            return (
              <Tooltip title={error}>
                <Tag color="error">{text}</Tag>
              </Tooltip>
            );
          default:
            return isWithinMins(createdAt, 120) ? (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {text}
              </Tag>
            ) : (
              <Tooltip title={error}>
                {" "}
                <Tag color="warning">{"fail"}</Tag>
              </Tooltip>
            );
        }
      },
    },
    {
      title: "Submitted by",
      // width: 240,
      render: (_, record) => {
        if (record?.username === "") {
          record.username = null;
        }
        if (record?.email === "") {
          record.email = null;
        }
        return (
          <Typography.Text>
            {record?.username ?? record?.email ?? "-"}
          </Typography.Text>
        );
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
          <Space size={[5, 5]} wrap>
            {record?.data?.protocol_slug && (
              <Button
                type="link"
                size="small"
                href={`https://www.footprint.network/@rogerD/Address-Analysis-of-GameFi-Project?protocol_name=${record?.data?.protocol_slug}&date_range=past90days#type=dashboard`}
                target={"_blank"}
              >
                Analytics
              </Button>
            )}
            {record?.data?.protocol_slug && (
              <Button
                type="link"
                size="small"
                href={`https://www.footprint.network/@Bond/Protocol-static-info?protocol_slug=${record?.data?.protocol_slug}`}
                target={"_blank"}
              >
                Detail
              </Button>
            )}
            <Button
              type="link"
              size="small"
              href="https://docs.footprint.network/reference/get_protocol-getprotocolcontractlist"
              target={"_blank"}
            >
              API
            </Button>
          </Space>
        );
      },
    },
  ].filter(i => i);
  return (
    <Table
      size="small"
      rowKey="_id"
      columns={recordType === "protocol" ? protocolColumns : contractColumns}
      dataSource={data}
      pagination={pagination}
      rowClassName={tableRowClassName || "SubmitContract__table-row"}
    />
  );
};

export default RefContractTable;
