/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Editor from "@toast-ui/editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "./publish.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Select,
  Skeleton,
  Upload,
} from "antd";
import Icon from "metabase/components/Icon";
import { uploadFile } from "metabase/lib/oss";

import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { push, replace } from "react-router-redux";
import { mediaCreate, mediaDetail, mediaEdit } from "metabase/new-service";
import { articleDetailUrl } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";
// eslint-disable-next-line import/named
import {
  formatHtmlFromImg,
  getArticleFileName,
  getUrl,
  googleSheetToCleanHtml,
} from "metabase/containers/news/util/handle";
import { ossPath } from "metabase/lib/ossPath";
import { staticBucketUrlDefault } from "metabase/env";
import { formatArticleSaveTitle } from "metabase/lib/formatting";

const Publish = props => {
  const { id, onReplaceLocation } = props;
  const editorRef = React.createRef();
  const conversionRef = React.createRef();
  const [imageUrl, setImageUrl] = useState();
  const [initialValues, setInitialValues] = useState();
  const [show, setShow] = useState(false);
  const [userChangeValue, setUserChangeValue] = useState(false);
  const [isArticle, setIsArticle] = useState(true);
  const [hasInputUrl, setHasInputUrl] = useState(false);
  const [editor, setEditor] = useState();
  const [tempHtml, setTempHtml] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initHtml = () => {
    return (
      tempHtml || (initialValues && initialValues.html && initialValues.html)
    );
  };

  useEffect(() => {
    const initEditor = () => {
      if (editorRef.current && !editor) {
        const _editor = new Editor({
          el: editorRef.current,
          height: "calc(100vh - 200px)",
          initialEditType: "wysiwyg",
          initialValue: initHtml(),
          usageStatistics: false,
          plugins: [colorSyntax],
        });
        setEditor(_editor);
        _editor.insertToolbarItem(
          { groupIndex: 3, itemIndex: -1 },
          {
            name: "imageConversion",
            el: conversionRef.current,
            tooltip: "Image conversion",
            className: "toastui-editor-toolbar-icons first",
          },
        );
      }
    };
    initEditor();
  }, [editor, editorRef, initHtml, conversionRef]);

  useEffect(() => {
    const _getDetail = async () => {
      const hide = message.loading("Loading...");
      try {
        const data = await mediaDetail({ mediaInfoId: id });
        const mediaInfoJson = { ...data };
        mediaInfoJson.isRecommend = mediaInfoJson.isRecommend || false;
        mediaInfoJson.initialValue = mediaInfoJson.html || "";
        setInitialValues(mediaInfoJson);
        setIsArticle(mediaInfoJson.type !== "realTimeInfo");
        const url = mediaInfoJson.url || "";
        setHasInputUrl(url.length > 0);
        setImageUrl(mediaInfoJson.thumbnail);
      } catch (e) {
      } finally {
        hide && hide();
        setShow(true);
      }
    };
    if (id) {
      _getDetail();
    } else {
      setShow(true);
    }
  }, [id]);

  useEffect(() => {
    if (editor) {
      if (hasInputUrl) {
        editor.hide();
      } else {
        editor.show();
      }
    }
  }, [editor, hasInputUrl]);

  const uploadButton = (
    <div className="publish__thumb-default publish__item-border">
      {imageUrl ? (
        <React.Fragment>
          <img
            src={imageUrl}
            alt="Footprint analytics"
            style={{ width: "100%" }}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Icon name="upload" size={20} color="#A7AABC" />
          <div style={{ marginTop: 8 }}>Upload thumbnail</div>
          <div style={{ marginTop: 8 }}>(300 * 157)</div>
        </React.Fragment>
      )}
    </div>
  );

  const conversionBase64ImageAndCleanHtml = async () => {
    const hide = message.loading("Upload...", 0);
    let html = await formatHtmlFromImg(editor.getHTML());
    html = googleSheetToCleanHtml(html);
    resetEditorHtml(html);
    hide();
    message.success("Image conversion succeeded.");
  };

  const resetEditorHtml = html => {
    setTempHtml(html);
    editor.removeToolbarItem("imageConversion");
    setEditor(undefined);
  };

  const onFinish = async values => {
    trackStructEvent("publish click submit");
    const hide = message.loading("Upload...", 0);
    const formatHtml = await formatHtmlFromImg(editor.getHTML());
    const data = {
      ...values,
      thumbnail: imageUrl,
      html: formatHtml,
      title: formatArticleSaveTitle(values.title),
    };
    try {
      let mediaInfoId;
      if (id) {
        await mediaEdit({ mediaInfoId: id, update: data });
        mediaInfoId = id;
      } else {
        const result = await mediaCreate(data);
        mediaInfoId = result.mediaInfoId;
      }
      onReplaceLocation(
        articleDetailUrl({ type: data.type, title: data.title, mediaInfoId }),
      );
    } catch (e) {
    } finally {
      hide();
    }
  };

  const uploadAction = async file => {
    const fileName = getArticleFileName(file);

    const hide = message.loading("Upload...", 0);
    try {
      await uploadFile({ fileName, file });
      setImageUrl(`${staticBucketUrlDefault}/${ossPath(fileName)}`);
      return getUrl(fileName);
    } catch (e) {
    } finally {
      hide && hide();
    }
  };

  return (
    <div className="publish">
      {show ? (
        <Form
          className="publish__inner"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            size: "large",
            type: "article",
            ...initialValues,
          }}
          size={"large"}
          onValuesChange={() => setUserChangeValue(true)}
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please input Title.",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Title"
              rows={1}
              maxLength={150}
              showCount
              allowClear
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 4 }}
            name="type"
            rules={[
              {
                required: true,
                message: "Please select Type.",
              },
            ]}
          >
            <Select onChange={type => setIsArticle(type !== "realTimeInfo")}>
              <Select.Option value="article">Article</Select.Option>
              <Select.Option value="dailyNews">Daily News</Select.Option>
              <Select.Option value="realTimeInfo">Flash</Select.Option>
            </Select>
          </Form.Item>
          {isArticle && (
            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input Description.",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Description"
                rows={6}
                maxLength={500}
                showCount
                allowClear
              />
            </Form.Item>
          )}
          {isArticle && (
            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              rules={[
                () => ({
                  validator(_, value) {
                    if (value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please upload thumb."));
                  },
                }),
              ]}
            >
              <Upload
                name="thumbnail"
                className="thumb-upload"
                showUploadList={false}
                action={uploadAction}
                fileList={[]}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          )}
          <Form.Item name="isRecommend" valuePropName="checked">
            <Checkbox defaultChecked={false}>Recommend</Checkbox>
          </Form.Item>

          <Form.Item name="url">
            <Input.TextArea
              placeholder="Backlink"
              rows={1}
              maxLength={200}
              showCount
              allowClear
              onInput={event => {
                const textLength = event.currentTarget.value.length;
                setHasInputUrl(textLength > 0);
              }}
            />
          </Form.Item>

          <Form.Item label={hasInputUrl ? "" : "Content"} name="content">
            <div id="editor" ref={editorRef} className="markdown" />
          </Form.Item>
          <Form.Item>
            <div className="publish__submit">
              <div className="publish__submit-inner">
                <Button
                  onClick={() => {
                    trackStructEvent("publish click exit");
                    if (userChangeValue) {
                      Modal.confirm({
                        title: "Exit",
                        content:
                          "Do you want to leave and exit this page without saving article?",
                        okText: "Yes",
                        cancelText: "No",
                        onOk: () => {
                          window.history.back();
                        },
                      });
                    } else {
                      window.history.back();
                    }
                  }}
                >
                  Exit
                </Button>
                <Button type="primary" htmlType="submit">
                  Publish
                </Button>
              </div>
            </div>
          </Form.Item>
          <button
            ref={conversionRef}
            style={{ margin: 0 }}
            onClick={e => {
              e.preventDefault();
              conversionBase64ImageAndCleanHtml();
            }}
          >
            <Icon name="conversion" size={24} />
          </button>
        </Form>
      ) : (
        <div className="publish__skeleton">
          <Skeleton active />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    id: props.params.slug,
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  onReplaceLocation: replace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);
