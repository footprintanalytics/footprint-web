/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import { get, words } from "lodash";
import { addTagging, deleteTag, getEntityTag } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { CardApi } from "metabase/services";

const TitleExtraInfoModal = ({
   onClose,
   card
 }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose && onClose();
  };

  const onSeoSubmit = async data => {
    card.visualization_settings["common.title_extra_info"] = data.content.trim()
    setLoading(true);
    await CardApi.update(card)
    setLoading(false);
    message.success("Title Extra Info updated successfully");
    onClose()
  };

  return (
    <Modal
      className="tagging-modal"
      open={true}
      footer={null}
      maskClosable={false}
      title={"Title Extra Info"}
      onCancel={onCancel}
    >
      <div className="flex flex-column p4">
        <div className={"mb2"}>Old Value: {get(card?.visualization_settings, "common.title_extra_info")}</div>
        <Form
          layout="vertical"
          ref={formRef}
          name="control-ref"
          onFinish={onSeoSubmit}
        >
          <div className="text-centered">
            <Form.Item name="content">
              <Input
                placeholder="Title Extra Info"
              />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(TitleExtraInfoModal);
