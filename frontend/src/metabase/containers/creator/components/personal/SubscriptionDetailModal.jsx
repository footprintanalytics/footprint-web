/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import { Button, Table } from "antd";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import "./SubscriptionDetailModal.css";

const SubscriptionDetailModal = ({ onClose, subscriptionDetailList, onCancelSubscription }) => {
  const columns = [
    {
      title: 'Type',
      width: 160,
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.service === "dataApi" ? "Data API" : "Footprint Analytics"}
          </div>
        )
      }
    },
    {
      title: 'Plan',
      dataIndex: 'groupType',
      align: "center",
      width: 200,
    },
    {
      title: "",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <Button onClick={() => onCancelSubscription(record.productId)}>cancel automatic renewal</Button>
          </div>
        )
      }
    }
  ];
  return (
    <Modal ModalClass="subscription-detail-modal">
      <ModalContent
        onClose={onClose}
        className="subscription-detail-modal__root"
        formModal={false}
      >
        <div style={{ marginTop: 12, maxHeight: 300, overflow: "auto", maxWidth: 640 }}>
          <Table
            columns={columns}
            dataSource={subscriptionDetailList}
            pagination={false}
            sticky={true}
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default SubscriptionDetailModal;
