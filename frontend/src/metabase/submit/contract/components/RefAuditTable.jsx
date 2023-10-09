/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { getRefAuditList, doRefAudit } from "metabase/new-service";

const RefAuditTable = ({ operator, type }) => {
  const [param, setParam] = useState();
  const [remark, setRemark] = useState("");
  const [openAuditModal, setOpenAuditModal] = useState({
    open: false,
    item: null,
  });
  useEffect(() => {
    if (type) {
      if (type === "pending") {
        setParam({ status: "reviewing", offset: 0, limit: 100 });
      } else {
        setParam({ status: null, offset: 0, limit: 100 });
      }
    }
  }, [type]);

  const { isLoading, data, refetch } = useQuery(
    ["getRefAuditList", param],
    async () => {
      return await getRefAuditList(param);
    },
    {
      enabled: !!param,
      refetchOnWindowFocus: false,
      retry: 2,
      refetchInterval: 10000,
    },
  );
  const [auditing, setAuditing] = useState({ isLoading: false, pass: false });
  const onAudit = (item, remark, pass = false) => {
    console.log(item, remark, pass);
    if (!remark) {
      message.error("Please input the remark.");
      return;
    }
    const params = {
      record_id: item._id,
      status: pass ? "approved" : "rejected",
      reason: remark,
      operator,
    };
    setAuditing({ isLoading: true, pass });
    doRefAudit(params)
      .then(res => {
        refetch();
        setRemark("");
        setOpenAuditModal({ open: false, item: null });
      })
      .catch(err => {
        message.error("Audit failed.", err);
        console.log(err);
      })
      .finally(() => {
        setAuditing({ isLoading: false, pass });
      });
  };

  const findDifferentFields = (oldObj, newObj) => {
    const differentFields = [];
    for (const key in newObj) {
      if (
        Object.prototype.hasOwnProperty.call(newObj, key) &&
        newObj[key] !== null &&
        newObj[key] !== "" && // 值不为 null 或空字符串
        oldObj?.[key] !== newObj[key] // 值不相同
      ) {
        differentFields.push({
          name: key,
          old: oldObj?.[key],
          new: newObj[key],
        });
      }
    }
    console.log("findDifferentFields", differentFields);
    return differentFields;
  };

  const columns = [
    {
      title: "Name",
      width: 200,
      render: (_, record) => {
        return (
          <>
            <Typography.Text>
              {record?.old_protocol_obj?.protocol_name ||
                record?.new_protocol_obj?.protocol_name ||
                record?.protocol_slug}
            </Typography.Text>
            {!record?.old_protocol_obj && (
              <Tag color="red" className=" ml1">
                New
              </Tag>
            )}
          </>
        );
      },
    },

    {
      title: "Change value",
      render: (_, record) => {
        const change = findDifferentFields(
          record?.old_protocol_obj,
          record?.new_protocol_obj,
        );
        return (
          <div className="flex flex-col">
            {change.map((item, index) => {
              return (
                <div key={index}>
                  <Typography.Text>
                    {item.name}:{" "}
                    {item.old && (
                      <>
                        <code>{item.old}</code> {"->"}
                      </>
                    )}
                    <code>{item.new}</code>
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Submitted by",
      // width: 240,
      render: (_, record) => {
        if (record?.created_by === "") {
          record.created_by = null;
        }
        if (record?.email === "") {
          record.email = null;
        }
        return (
          <Typography.Text>
            {record?.created_by ?? record?.email ?? "-"}
          </Typography.Text>
        );
      },
    },
    {
      title: "Submitted at",
      dataIndex: "created_at",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Status",
      render: (_, { status, createdAt, reason }) => {
        const text = status;
        switch (text) {
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "pending review":
          case "pending":
            return <Tag color="processing">{"pending"}</Tag>;
          case "submitted":
          case "approved":
            return (
              <Tooltip title={reason}>
                <Tag color="success">{text}</Tag>
              </Tooltip>
            );
          case "rejected":
            return (
              <Tooltip title={reason}>
                <Tag color="error">{text}</Tag>
              </Tooltip>
            );
          default:
            <Tooltip title={reason}>
              <Tag color="warning">{"fail"}</Tag>
            </Tooltip>;
        }
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="primary"
              disabled={record?.status !== "reviewing"}
              onClick={() => {
                setOpenAuditModal({ open: true, item: record });
              }}
            >
              Audit
            </Button>
          </div>
        );
      },
    },
  ].filter(i => i);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
      ) : (
        <Table
          size="small"
          rowKey="_id"
          columns={columns}
          dataSource={data?.list}
          pagination={false}
        />
      )}
      {openAuditModal?.open && (
        <Modal
          open={openAuditModal?.open}
          title={`Audit [${openAuditModal?.item?.protocol_slug}]`}
          onCancel={() => {
            setOpenAuditModal({ open: false, item: null });
          }}
          footer={null}
        >
          <div className="flex flex-col w-full mt-10">
            <Input.TextArea
              rows={10}
              placeholder="Input the remark of this submit record."
              onChange={e => {
                setRemark(e.target.value);
              }}
            />
            <div className=" flex flex-row-reverse w-full mt-20">
              <Button
                type="primary"
                loading={auditing?.isLoading && auditing?.pass}
                className=" ml-10"
                onClick={() => {
                  onAudit(openAuditModal?.item, remark, true);
                }}
              >
                Pass
              </Button>

              <Button
                type="default"
                loading={auditing?.isLoading && !auditing?.pass}
                onClick={() => {
                  onAudit(openAuditModal?.item, remark, false);
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default RefAuditTable;
