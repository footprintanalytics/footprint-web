/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import { Button, Popover, Space } from "antd";
import { Container } from "./DashboardEmptyState.styled";
import EmptyState from "metabase/components/EmptyState";
import { Icon } from "metabase/collections/containers/CollectionSidebar/CollectionSidebarFooter/CollectionSidebarFooter.styled";
import "./DashboardEmptyState.css";
import {
  LineChartOutlined,
  FileTextOutlined,
  FileImageOutlined,
  YoutubeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { trackStructEvent } from "metabase/lib/analytics";

const propTypes = {
  isNightMode: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
};

export const AddToolPopover = props => {
  if (props.visible === false) return props.children;
  const dashId = props.dashboard.id;

  return (
    <Popover
      key={props.gridItemWidth + "" + props.dashId}
      getPopupContainer={props.getPopupContainer}
      visible
      overlayClassName="AddToolPopover"
      placement="bottomLeft"
      zIndex={2}
      content={
        <div className="AddToolPopover-content">
          <div
            className="AddToolPopover-content-l"
            onClick={() => {
              props.onToggleAddQuestionSidebar();
              trackStructEvent("Add Tooltip", "Add chart");
            }}
          >
            <Icon name="explore_add" size={60} color={"#3334B2"} />
          </div>
          <div className="AddToolPopover-content-r">
            <h3>
              <span>👋</span>Hi, now you can
            </h3>
            <Space className="AddToolPopover-tools" direction="vertical">
              <Button
                icon={<LineChartOutlined />}
                type="dashed"
                onClick={() => {
                  props.onToggleAddQuestionSidebar();
                  trackStructEvent("Add Tooltip", "Add chart");
                }}
              >
                Add chart
              </Button>
              <Button
                icon={<FileTextOutlined />}
                type="dashed"
                onClick={() => {
                  props.addTextDashCardToDashboard({ dashId });
                  trackStructEvent("Add Tooltip", "Add text");
                }}
              >
                Add text
              </Button>
              <Button
                icon={<FileImageOutlined />}
                type="dashed"
                onClick={() => {
                  props.addImageDashCardToDashboard({ dashId });
                  trackStructEvent("Add Tooltip", "image");
                }}
              >
                Add image
              </Button>
              <Button
                icon={<YoutubeOutlined />}
                type="dashed"
                onClick={() => {
                  props.addVideoDashCardToDashboard({ dashId });
                  trackStructEvent("Add Tooltip", "Add video");
                }}
              >
                Add video
              </Button>
              <Button
                icon={<FilterOutlined />}
                type="dashed"
                onClick={() => {
                  props.showAddParameterPopover();
                  trackStructEvent("Add Tooltip", "Add filter");
                }}
              >
                Add filter
              </Button>
            </Space>
          </div>
        </div>
      }
    >
      {props.children}
    </Popover>
  );
};

const renderCreatePanel = props => {
  return (
    <div
      key={"addCharts"}
      className="flex"
      style={{ flex: 1, flexDirection: "column", alignItems: "left" }}
    >
      <AddToolPopover {...props}>
        <div className="HiddenCreatePanel" />
      </AddToolPopover>
    </div>
  );
};

const questionCircle = <span className="QuestionCircle">?</span>;

const DashboardEmptyState = ({ isNightMode, isEditing, ...props }) => (
  <Container isNightMode={isNightMode}>
    {isEditing ? (
      renderCreatePanel(props)
    ) : (
      <EmptyState
        illustrationElement={questionCircle}
        title={t`This dashboard is looking empty.`}
        message={t`Add a question to start making it useful!`}
      />
    )}
  </Container>
);

DashboardEmptyState.propTypes = propTypes;

export default DashboardEmptyState;
