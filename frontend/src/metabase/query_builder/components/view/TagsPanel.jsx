import React from "react";
import { connect } from "react-redux";
import { Tag, Input, Tooltip, Skeleton } from "antd";
import { PlusOutlined } from "../../../lib/ant-icon";
import { addTagging, deleteTag, getEntityTag } from "metabase/new-service";
import PropTypes from "prop-types";
import { remove } from "lodash";
import Link from "metabase/components/Link";
import Meta from "metabase/components/Meta";
import cx from "classnames";
import { deviceInfo } from "metabase-lib/lib/Device";

class TagsPanel extends React.Component {
  state = {
    tagEntityList: null,
    seoTagEntityList: null,
    inputVisible: false,
    inputValue: "",
    editInputValue: "",
    currentEntityNsName: "",
    hover: false,
  };

  componentDidMount() {
    const { user, tagEntityId } = this.props;
    if (tagEntityId) {
      this.getTagData();
    }
    this.handleCurrentEntityNsName(user);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (!this.props.user && newProps.user) {
      this.handleCurrentEntityNsName(newProps.user);
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  handleCurrentEntityNsName = user => {
    const host = "www.footprint.network";
    const id = user ? user.id : "";
    this.setState({ currentEntityNsName: `${host}/${id}` });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    if (inputValue.length > 0) {
      this.tagAdd(inputValue);
    }
    this.setState({
      inputVisible: false,
      inputValue: "",
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  saveInputRef = input => {
    this.input = input;
  };

  tagPanelRef = el => {
    this.tagPanel = el;
  };

  getTagData = async () => {
    const { showSeoTagEntityList } = this.props;
    const entityId = `${this.props.tagEntityId}`;
    const [tagEntityList, seoTagEntityList] = await Promise.all([
      getEntityTag({ entityId, entityTypeNsName: this.props.type }),
      showSeoTagEntityList
        ? getEntityTag({ entityId, entityTypeNsName: `seo_${this.props.type}` })
        : null,
    ]);
    this.setState({ tagEntityList, seoTagEntityList });
  };

  tagRemove = async item => {
    deleteTag({
      opId: `${this.props.user.id}`,
      entityTagList: [item],
    });
    const { tagName, entityId, entityTypeNsName, entityNsName } = item;
    remove(
      this.state.tagEntityList,
      item =>
        item.tagName === tagName &&
        item.entityId === entityId &&
        item.entityTypeNsName === entityTypeNsName &&
        item.entityNsName === entityNsName,
    );
  };

  tagAdd = async tagName => {
    const host = "www.footprint.network";
    const newTag = {
      tagName: `${tagName}`,
      entityId: `${this.props.tagEntityId}`,
      entityTypeNsName: this.props.type,
      entityNsName: `${host}/${this.props.user.id}`,
    };
    if (this.canAdd(newTag)) {
      addTagging({
        opId: `${this.props.user.id}`,
        entityTagList: [newTag],
      });
      this.setState(
        pre => ({
          ...pre,
          tagEntityList: [...pre.tagEntityList, newTag],
        }),
        () => {
          this.scrollToRight();
        },
      );
      // this.state.tagEntityList.push(newTag);
    }
  };

  canAdd = ({ tagName, entityId, entityTypeNsName, entityNsName }) => {
    return !this.state.tagEntityList?.find(
      item =>
        item.tagName === tagName &&
        item.entityId === entityId &&
        item.entityTypeNsName === entityTypeNsName &&
        item.entityNsName === entityNsName,
    );
  };

  getKey = item => {
    const { tagName, entityId, entityNsName, entityTypeNsName } = item;
    return `${tagName}${entityId}${entityNsName}${entityTypeNsName}`;
  };

  scrollToRight() {
    if (this.tagPanel) {
      const scrollWidth = this.tagPanel.scrollWidth;
      const width = this.tagPanel.clientWidth;
      const maxScrollRight = scrollWidth - width;
      this.tagPanel.scrollLeft = Math.max(0, maxScrollRight);
    }
  }

  renderTags({ isLongTag, item, tagName }) {
    return isLongTag ? `#${item.tagName.slice(0, 20)}...` : `#${tagName}`;
  }

  render() {
    const {
      tagEntityList,
      seoTagEntityList,
      inputVisible,
      inputValue,
      hover,
    } = this.state;
    const {
      tagEntityId,
      isEditPermission,
      user,
      type,
      showSkeleton,
    } = this.props;

    let keywords;
    if (seoTagEntityList?.length) {
      keywords = seoTagEntityList?.map(item => item.tagName).join(", ");
    } else {
      if (tagEntityList?.length) {
        keywords = tagEntityList?.map(item => item.tagName).join(", ");
      }
    }

    const isMobile = deviceInfo().isMobile;

    if (showSkeleton && !this.state.tagEntityList) {
      return <Skeleton active />;
    }

    return (
      <>
        <Meta keywords={keywords} />
        <div
          className={cx(
            "flex",
            isMobile || hover
              ? "overflow-x-auto overflow-y-hidden"
              : "overflow-hidden",
          )}
          style={{
            height: tagEntityList && tagEntityList.length > 0 ? 46 : "auto",
            alignItems: "flex-start",
          }}
          onMouseLeave={() => this.setState({ hover: false })}
          onMouseOver={() => this.setState({ hover: true })}
        >
          <div ref={this.tagPanelRef} className="flex">
            {tagEntityList &&
              tagEntityList.map(item => {
                const { tagName, entityNsName } = item;
                const tagBackground =
                  entityNsName === "system" ? "#F1F1F1" : "#EEEEFF";
                const tagColor =
                  entityNsName === "system" ? "#666666" : "#3434B2";
                const tagBorder =
                  entityNsName === "system"
                    ? "#D8D8D8 solid 1px"
                    : "#CCCCFF solid 1px";
                const isLongTag = tagName.length > 20;
                const tagElem = (
                  <Tag
                    style={{
                      padding: "1px 7px",
                      margin: "3px 3px",
                      background: tagBackground,
                      color: tagColor,
                      border: tagBorder,
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    key={this.getKey(item)}
                    closable={
                      user &&
                      isEditPermission &&
                      entityNsName === this.state.currentEntityNsName
                    }
                    onClose={() => this.tagRemove(item)}
                  >
                    {this.props.canClick ? (
                      <Link
                        href={`/search?q=${tagName}&model=${type}`}
                        target="_blank"
                      >
                        {this.renderTags({ isLongTag, item, tagName })}
                      </Link>
                    ) : (
                      <React.Fragment>
                        {this.renderTags({ isLongTag, item, tagName })}
                      </React.Fragment>
                    )}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={item.tagName} key={this.getKey(item)}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
          </div>
          {user && tagEntityId && isEditPermission && inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{
                width: 80,
                height: 25,
                padding: "1px 7px",
                margin:
                  tagEntityList?.length > 0 ? "3px 0 6px 12px" : "3px 0 6px 0",
              }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {user && tagEntityId && isEditPermission && !inputVisible && (
            <Tag
              style={{
                width: 80,
                borderRadius: 4,
                background: "#fff",
                borderStyle: "dashed",
                padding: "1px 7px",
                margin:
                  tagEntityList?.length > 0 ? "3px 0 6px 12px" : "3px 0 6px 0",
                display: "flex",
                alignItems: "center",
                height: 25,
                cursor: "pointer",
              }}
              onClick={this.showInput}
            >
              <PlusOutlined className="footprint-mr-xs" /> New Tag
            </Tag>
          )}
        </div>
      </>
    );
  }
}

TagsPanel.propTypes = {
  user: PropTypes.object,
  id: PropTypes.any,
  tagEntityId: PropTypes.any,
  type: PropTypes.string,
  isEditPermission: PropTypes.bool,
  canClick: PropTypes.bool,
  showSkeleton: PropTypes.bool,
  showSeoTagEntityList: PropTypes.bool,
};

TagsPanel.defaultProps = {
  isEditPermission: true,
  type: "",
  canClick: true,
  showSkeleton: false,
  showSeoTagEntityList: false,
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(TagsPanel);
