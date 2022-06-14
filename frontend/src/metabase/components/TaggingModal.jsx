/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Flex } from "grid-styled";
import { Button, Form, Input, message, Modal } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import { words } from "lodash";
import { addTagging, deleteTag, getEntityTag } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

const TaggingModal = ({
  onClose,
  id,
  name,
  creatorId,
  user,
  type = "dashboard", //"dashboard", "card"
}) => {
  const formRef = useRef(null);
  const [seoTagEntityList, setSeoTagEntityList] = useState();
  const [loading, setLoading] = useState(false);
  const tagContentRef = React.createRef();

  useEffect(() => {
    const getData = async () => {
      const hide = message.loading("Loading...", 0);
      const seoTagEntityList = await getEntityTag({
        entityId: `${id}`,
        entityTypeNsName: `seo_${type}`,
      });
      hide();
      setSeoTagEntityList(seoTagEntityList);
    };
    getData();
  }, [id, type]);

  const delSeoTags = () => {
    deleteTag({
      opId: `${user.id}`,
      entityTagList: seoTagEntityList,
    });
  };

  const setSeoTags = async list => {
    const host = "www.footprint.network";
    await addTagging({
      opId: `${user.id}`,
      entityTagList: list.map(tag => {
        return {
          entityId: `${id}`,
          entityNsName: `${host}/${creatorId}`,
          entityTypeNsName: `seo_${type}`,
          tagName: tag,
        };
      }),
    });
    const seoTagEntityList = await getEntityTag({
      entityId: `${id}`,
      entityTypeNsName: `seo_${type}`,
    });
    setSeoTagEntityList(seoTagEntityList);
  };

  const onSeoSubmit = async data => {
    const newSeoTags = words(data.content, /[^,\n]+/g)
      .map(s => s.trim())
      .filter(s => s !== "");
    setLoading(true);
    await delSeoTags();
    setTimeout(async () => {
      await setSeoTags(newSeoTags);
      setLoading(false);
      message.info("Success tagging seo tag.");
    }, 1000);
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
      title={"Seo tagging"}
      onCancel={onCancel}
    >
      {name && <div className="footprint-title2">{name}</div>}
      <Flex p={20} flexDirection="column">
        <Form
          layout="vertical"
          ref={formRef}
          name="control-ref"
          onFinish={onSeoSubmit}
        >
          <div className="text-centered">
            <Form.Item name="current" label="Current seo tags:">
              <div className="text-left bg-gray p1">
                {seoTagEntityList &&
                  (seoTagEntityList.length > 0
                    ? seoTagEntityList.map(entity => entity.tagName).join(", ")
                    : "No seo tags.")}
              </div>
            </Form.Item>
            <Form.Item name="content">
              <Input.TextArea
                ref={tagContentRef}
                placeholder="Seo tags. Separator is newline or comma."
                rows={5}
                maxLength={300}
                showCount
                allowClear
              />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              loading={loading}
            >
              Tagging
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

export default connect(mapStateToProps, null)(TaggingModal);
