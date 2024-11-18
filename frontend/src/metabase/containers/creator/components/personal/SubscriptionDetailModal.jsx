/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import { Button, Table, Modal } from "antd";
import "./SubscriptionDetailModal.css";
import { showCancelAutoRenewal } from 'metabase/utils/Utils';

const SubscriptionDetailModal = ({ open, onClose, subscriptionDetailList }) => {
  const [modal, contextHolder] = Modal.useModal();
  const onCancelSubscription = async productId => {
    showCancelAutoRenewal({
      modal: modal,
      productId,
      title: "Do you want to cancel automatic renewal?",
      onSuccess: () => {
        location.reload();
      }
    });
  };
  const columns = [
    {
      title: 'Type',
      width: 160,
      align: "center",
      render: (_, record) => {
        const mapping = {
          dataApi: "Data API",
          footprint: "Footprint Analytics",
          fga: "FGA"
        }
        return (
          <div>
            {mapping[record.service]}
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
      width: 220,
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <Button onClick={() => onCancelSubscription(record.productId)}>Cancel Automatic Renewal</Button>
          </div>
        )
      }
    }
  ];
  return (
    <Modal 
      width={640}
      style={{ maxHeight: 400, overflow: "auto"}}
      open={true}
      onCancel={onClose}
      closable={true}
      title="Subscription Detail"
      footer={null}
      destroyOnClose
      maskClosable={true}
    >
      {contextHolder}
      <Table
        columns={columns}
        dataSource={subscriptionDetailList}
        pagination={false}
        sticky={true}
      />
    </Modal>
  );
};

export default SubscriptionDetailModal;
