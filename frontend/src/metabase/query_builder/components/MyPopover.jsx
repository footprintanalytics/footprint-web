/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from "react";
import { Popover } from "antd";
import "./MyPopover.css";
import { connect } from "react-redux";
import {
  getCloseAllChartPopover,
  getNextChartPopover,
} from "metabase/selectors/control";
import {
  closeAllChartPopoverAction,
  nextChartPopoverAction,
} from "metabase/redux/control";
import MyPopoverData from "metabase/query_builder/components/MyPopoverData";
import {
  canAutoShowChartPopover,
  setNeverShowChartPopover,
} from "metabase/query_builder/components/MyPopoverUtil";
import Button from "metabase/components/Button";
import { getUser } from "metabase/selectors/user";
import { canShowNewGuideStart } from "metabase/containers/newguide/newGuide";

const MyPopover = React.memo(props => {
  const {
    enabled = true,
    placement,
    delayModel,
    delayShow = false,
    name,
    next,
    getNextChartPopover,
    getCloseAllChartPopover,
    nextChartPopoverAction,
    openDelayTime = 800,
    user,
    children,
  } = props;
  const [visible, setVisible] = useState(false);
  const changeNext = (getNextChartPopover || {}).next;
  const closeEvent = (getCloseAllChartPopover || {}).time;
  const { title, content } = MyPopoverData[name] || {};
  const userNewGuide = canShowNewGuideStart(user);

  useEffect(() => {
    let timeoutResult = null;
    if (!delayModel || delayShow) {
      timeoutResult = open();
    }
    return () => {
      if (timeoutResult && timeoutResult.length > 0) {
        timeoutResult.forEach(item => {
          if (item) {
            clearTimeout(timeoutResult);
          }
        });
      }
    };
  }, [delayModel, delayShow, open]);

  useEffect(() => {
    let timeoutResult = null;
    if (changeNext === name) {
      timeoutResult = open();
    }
    return () => {
      if (timeoutResult && timeoutResult.length > 0) {
        timeoutResult.forEach(item => {
          if (item) {
            clearTimeout(timeoutResult);
          }
        });
      }
    };
  }, [changeNext, name, open]);

  useEffect(() => {
    if (closeEvent) {
      close();
    }
  }, [closeEvent]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const open = useCallback(() => {
    if (
      !canAutoShowChartPopover() ||
      !enabled ||
      !MyPopoverData[name] ||
      userNewGuide
    ) {
      return;
    }
    if (MyPopoverData[name].use) {
      return;
    }
    const timeoutResult = [];
    const timeoutOpen = setTimeout(() => {
      setVisible(true);
      MyPopoverData[name].use = true;
    }, openDelayTime);
    timeoutResult.push(timeoutOpen);
    return timeoutResult;
  });

  const close = () => {
    setVisible(false);
  };

  const handleNext = () => {
    if (next) {
      nextChartPopoverAction({ next, time: new Date().getTime() });
    } else {
      nextChartPopoverAction({ next: null, time: new Date().getTime() });
    }
  };

  const renderContent = () => {
    return (
      <div className="my-popover">
        <div className="my-popover__head">
          <div className="my-popover__title">{title}</div>
        </div>
        <div className="my-popover__content">{content}</div>
        <div className="my-popover__buttons">
          <Button
            className="my-popover__never-show"
            onClick={() => {
              close();
              setNeverShowChartPopover();
            }}
          >
            {"Don't show again"}
          </Button>
          <div
            onClick={() => {
              close();
              handleNext();
            }}
            className="my-popover__close"
          >
            OK
          </div>
        </div>
      </div>
    );
  };
  if (!enabled) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <Popover
      content={renderContent}
      visible={visible}
      arrowPointAtCenter
      placement={placement}
      color={"#5C5CE0da"}
      overlayInnerStyle={{ padding: "8px 4px" }}
      autoAdjustOverflow
    >
      {children}
    </Popover>
  );
});

const mapStateToProps = state => ({
  getNextChartPopover: getNextChartPopover(state),
  getCloseAllChartPopover: getCloseAllChartPopover(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  nextChartPopoverAction,
  closeAllChartPopoverAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPopover);
