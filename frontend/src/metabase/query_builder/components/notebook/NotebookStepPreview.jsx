/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import cx from "classnames";
import _ from "underscore";

import { Motion, spring } from "react-motion";
import { isReducedMotionPreferred } from "metabase/lib/dom";

import Icon from "metabase/components/Icon";
import Button from "metabase/core/components/Button";

import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Visualization from "metabase/visualizations/components/Visualization";

import Question from "metabase-lib/Question";
import {
  PreviewButtonContainer,
  PreviewHeader,
  PreviewIconContainer,
  PreviewRoot,
} from "./NotebookStepPreview.styled";

class NotebookStepPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question || this.getPreviewQuestion(props.step),
    };
  }

  refresh = props => {
    const question = props?.question || this.props?.question;
    const step = props?.step || this.props?.step;
    this.setState({
      question: question || this.getPreviewQuestion(step),
    });
  };

  getPreviewQuestion(step) {
    const query = step.previewQuery;
    return Question.create()
      .setQuery(query.limit() < 10 ? query : query.updateLimit(10))
      .setDisplay("table")
      .setSettings({ "table.pivot": false });
  }

  getIsDirty(props) {
    const question = props?.question || this.props?.question;
    const step = props?.step || this.props?.step;
    const newQuestion = question || this.getPreviewQuestion(step);
    return !_.isEqual(newQuestion.card(), this.state.question.card());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.fromQueryPreview && this.getIsDirty(nextProps)) {
      this.refresh(nextProps);
    }
  }

  getHeight = result => {
    return this.props.height || getPreviewHeightForResult(result);
  };

  render() {
    const { onClose, fromQueryPreview, className, isPreview } = this.props;
    const { question } = this.state;

    const isDirty = this.getIsDirty();

    const preferReducedMotion = isReducedMotionPreferred();
    const springOpts = preferReducedMotion
      ? { stiffness: 500 }
      : { stiffness: 170 };

    return (
      <PreviewRoot>
        {!fromQueryPreview && (<PreviewHeader>
          <span className="text-bold">{t`Preview`}</span>
          <PreviewIconContainer>
            <Icon
              name="close"
              onClick={onClose}
              className="text-light text-medium-hover cursor-pointer ml1"
            />
          </PreviewIconContainer>
        </PreviewHeader>
        )}
        {!fromQueryPreview && isDirty ? (
          <PreviewButtonContainer className="bordered shadowed rounded bg-white p4">
            <Button onClick={this.refresh}>{t`Refresh`}</Button>
          </PreviewButtonContainer>
        ) : (
          <QuestionResultLoader question={question} isPreview={isPreview}>
            {({ rawSeries, result }) => (
              <Motion
                defaultStyle={{ height: 36 }}
                style={{
                  height: spring(this.getHeight(result), springOpts),
                }}
              >
                {({ height }) => {
                  const targetHeight = this.getHeight(result);
                  const snapHeight =
                    height > targetHeight / 2 ? targetHeight : 0;
                  const minHeight = preferReducedMotion ? snapHeight : height;
                  return (
                    <Visualization
                      rawSeries={rawSeries}
                      error={result && result.error}
                      className={cx("bordered shadowed rounded bg-white", {
                        p2: result && result.error,
                        bordered: !fromQueryPreview,
                        shadowed: !fromQueryPreview,
                      })}
                      style={{ minHeight: height }}
                    />
                  );
                }}
              </Motion>
            )}
          </QuestionResultLoader>
        )}
      </PreviewRoot>
    );
  }
}

function getPreviewHeightForResult(result) {
  const rowCount = result ? result.data.rows.length : 1;
  return rowCount * 36 + 36 + 2;
}

export default NotebookStepPreview;
