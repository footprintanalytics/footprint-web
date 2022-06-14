/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Flex } from "grid-styled";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import "./UserCancelFeedbackModal.css";
import { connect } from "react-redux";
import { feedback } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { trackStructEvent } from "metabase/lib/analytics";

const CheckboxGroup = Checkbox.Group;

const data = [
  {
    title: "Before you cancel, could tell us why?",
    question:
      "we're sorry you're thinking of leaving the page. Would you tell us why? We might be able to help.",
    questionId: 1,
    questionCollectionId: 1,
    type: "edit",
    answer: [
      "Technical difficulties",
      "There is no data that I need",
      "I don't know how to use this product",
      "Other",
    ],
  },
  {
    question:
      "it seems that you stay in this page for a long time. Would you tell us why? We might be able to help.",
    questionId: 2,
    questionCollectionId: 1,
    type: "view",
    answer: [
      "Technical difficulties",
      "I'm not interest in it",
      "I can not find anything I need",
      "Other",
    ],
  },
];

const UserCancelFeedbackModal = ({
  onClose,
  visible,
  cancelFeedback,
  user,
}) => {
  const formRef = useRef(null);
  const [selectList, setSelectList] = useState([]);
  const { type, afterSuccess, scene } = cancelFeedback;
  const questionData = data.find(item => item.type === type) || data[0];

  useEffect(() => {
    if (visible) {
      formRef &&
        formRef.current &&
        formRef.current.setFieldsValue({ feedback: [] });
      setSelectList([]);
      trackStructEvent(`view cancel-feedback-modal ${scene}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onSubmit = async data => {
    trackStructEvent(`click cancel-feedback-submit ${scene}`);

    let selects = data.feedback;
    const selectOther = selects.includes("Other");
    const withoutOtherSelects = selects.filter(item => item !== "Other");
    const other = data.other && data.other.trim();
    if (selectOther && other) {
      selects = [...withoutOtherSelects, other];
    } else {
      selects = [...withoutOtherSelects];
    }
    const hide = message.loading("Loading...", 0);
    await feedback({
      answers: selects,
      questionId: questionData.questionId,
      questionCollectionId: questionData.questionCollectionId,
      scene: scene,
    });
    hide();
    onClose && onClose();
    if (afterSuccess) {
      afterSuccess();
    }
  };

  const onCancel = () => {
    trackStructEvent(`click cancel-feedback-cancel ${scene}`);
    onClose && onClose();
    if (afterSuccess) {
      afterSuccess();
    }
  };

  const showOther = () => {
    return selectList.includes("Other");
  };

  const onChange = list => {
    setSelectList(list);
  };

  return (
    <Modal
      className="cancel-feedback"
      visible={visible}
      footer={null}
      maskClosable={false}
      onCancel={onCancel}
    >
      <Flex p={20} flexDirection="column">
        {questionData.title && (
          <div className="cancel-feedback-title">{questionData.title}</div>
        )}
        <div className="cancel-feedback-question">{`Hey ${
          user ? user.common_name : ""
        }, ${questionData.question}`}</div>
        <Form ref={formRef} name="control-ref" onFinish={onSubmit}>
          <Form.Item
            name="feedback"
            rules={[
              {
                required: true,
                message: "Please select at least one reason",
              },
            ]}
          >
            <CheckboxGroup onChange={onChange}>
              {questionData.answer.map(item => {
                return (
                  <div key={item} className="cancel-feedback-answer">
                    <Checkbox value={item}>
                      <span>{item}</span>
                    </Checkbox>
                  </div>
                );
              })}
            </CheckboxGroup>
          </Form.Item>
          <Form.Item
            name="other"
            style={{ display: showOther() ? "" : "none" }}
            rules={[
              {
                required: selectList.includes("Other"),
                message: "Please enter other reason",
                whitespace: true,
              },
            ]}
          >
            <Input className="right cancel-feedback-other" maxLength={256} />
          </Form.Item>
          <div className="text-centered pt3">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right cancel-feedback-submit"
            >
              Submit
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

export default connect(mapStateToProps, null)(UserCancelFeedbackModal);
