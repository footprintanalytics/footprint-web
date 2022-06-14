/* eslint-disable react/prop-types */
import React from "react";

import cx from "classnames";
import _ from "underscore";

import Icon from "metabase/components/Icon";
import Button from "metabase/components/Button";
import { Box, Flex } from "grid-styled";
import { Motion, spring } from "react-motion";

import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Visualization from "metabase/visualizations/components/Visualization";

import Question from "metabase-lib/lib/Question";

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
    const { onClose, fromQueryPreview, className } = this.props;
    const { question } = this.state;

    const isDirty = this.getIsDirty();

    return (
      <Box className={className} pt={fromQueryPreview ? 0 : 2}>
        {!fromQueryPreview && (
          <Flex align="center" justify="space-between" mb={1}>
            <span className="text-bold">{`Preview`}</span>
            <Flex align="right">
              <Icon
                name="close"
                onClick={onClose}
                className="text-light text-medium-hover cursor-pointer ml1"
              />
            </Flex>
          </Flex>
        )}
        {!fromQueryPreview && isDirty ? (
          <Flex
            align="center"
            justify="center"
            className="bordered shadowed rounded bg-white p4"
          >
            <Button onClick={this.refresh}>Refresh</Button>
          </Flex>
        ) : (
          <QuestionResultLoader question={question}>
            {({ rawSeries, result }) => (
              <Motion
                defaultStyle={{ height: 36 }}
                style={{ height: spring(this.getHeight(result)) }}
              >
                {({ height }) => (
                  <Visualization
                    rawSeries={rawSeries}
                    error={result && result.error}
                    className={cx("bg-white", {
                      p2: result && result.error,
                      bordered: !fromQueryPreview,
                      shadowed: !fromQueryPreview,
                    })}
                    style={{ minHeight: height }}
                  />
                )}
              </Motion>
            )}
          </QuestionResultLoader>
        )}
      </Box>
    );
  }
}

function getPreviewHeightForResult(result) {
  const rowCount = result && result.data ? result.data.rows.length : 1;
  return rowCount * 36 + 36 + 2;
}

export default NotebookStepPreview;
