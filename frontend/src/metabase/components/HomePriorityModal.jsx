/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import { Flex } from "grid-styled";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import { getHomeNewPriority, postHomeNewPriority } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { get } from "lodash";

const HomePriorityModal = ({ onClose, onSuccess, id, name }) => {
  const formRef = useRef(null);
  const tagContentRef = React.createRef();

  const { isLoading, data } = useQuery(
    ["getHomeNewPriority", id],
    async () => {
      return await getHomeNewPriority(id);
    },
    QUERY_OPTIONS,
  );
  const top5 = get(data, "top5");
  const curDashboard = get(data, "data");

  useEffect(() => {
    if (curDashboard) {
      formRef &&
        formRef.current &&
        formRef.current.setFieldsValue({
          sort: curDashboard.sort,
          hot: curDashboard.isHot,
        });
    }
  }, [curDashboard, data]);

  const onSubmit = async data => {
    const hide = message.loading("Loading...", 0);
    await postHomeNewPriority({
      dashboardId: id,
      sort: data.sort,
      isHot: data.hot,
    });
    hide();
    message.success("Setting success.");
    onSuccess && onSuccess();
    onClose && onClose();
  };

  const onCancel = () => {
    onClose && onClose();
  };

  return (
    <Modal
      className="tagging-modal"
      visible={true}
      footer={null}
      maskClosable={false}
      title={"Home priority"}
      onCancel={onCancel}
    >
      {name && <div className="footprint-title2">{name}</div>}
      <Flex p={20} flexDirection="column">
        <Form
          layout="vertical"
          ref={formRef}
          name="control-ref"
          onFinish={onSubmit}
        >
          <div className="text-centered">
            <Form.Item name="top5" label="Top 5:">
              <div className="text-left bg-gray p1">
                {top5?.length
                  ? top5.map(entity => entity.sort).join(", ")
                  : "No Data."}
              </div>
            </Form.Item>
            {curDashboard && (
              <Form.Item name="current" label="Current dashboard:">
                <div className="text-left bg-gray p1">
                  sort: {curDashboard?.sort}, isHot: {`${curDashboard?.isHot}`}
                </div>
              </Form.Item>
            )}
            <Form.Item name="sort">
              <Input ref={tagContentRef} placeholder="new sort" allowClear />
            </Form.Item>
            <Form.Item name="hot" valuePropName="checked">
              <Checkbox>Hot</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              loading={isLoading}
            >
              Set sort
            </Button>
          </div>
        </Form>
      </Flex>
    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(HomePriorityModal);
