/* eslint-disable react/prop-types */
import React from "react";

import { t, ngettext, msgid } from "ttag";

import StructuredQuery from "metabase-lib/queries/StructuredQuery";
import QuestionDataSource from "./QuestionDataSource";

import { AggregationAndBreakoutDescription } from "./QuestionDescription.styled";
import { get } from "lodash";

const QuestionDescription = ({
  question,
  originalQuestion,
  isObjectDetail,
  onClick,
}) => {
  const query = question.query();
  const createMethod = get(question, "_card.create_method");

  if (createMethod === "template" || createMethod === "preview") {
    return <span>{get(question, "_card.name")}</span>;
  }

  if (query instanceof StructuredQuery) {
    const topQuery = query.topLevelQuery();
    const aggregations = topQuery.aggregations();
    const breakouts = topQuery.breakouts();
    const aggregationDescription =
      aggregations.length === 0
        ? null
        : aggregations.length > 2
        ? ngettext(
            msgid`${aggregations.length} metric`,
            `${aggregations.length} metrics`,
            aggregations.length,
          )
        : aggregations
            .map(aggregation => aggregation.displayName())
            .join(t` and `);
    const breakoutDescription =
      breakouts.length === 0
        ? null
        : breakouts.length > 2
        ? ngettext(
            msgid`${breakouts.length} breakout`,
            `${breakouts.length} breakouts`,
            breakouts.length,
          )
        : breakouts.map(breakout => breakout.displayName()).join(t` and `);
    if (aggregationDescription || breakoutDescription) {
      return (
        <AggregationAndBreakoutDescription onClick={onClick}>
          {[aggregationDescription, breakoutDescription]
            .filter(Boolean)
            .join(t` by `)}
        </AggregationAndBreakoutDescription>
      );
    }
  }
  if (question.database()) {
    return (
      <QuestionDataSource
        question={question}
        originalQuestion={originalQuestion}
        isObjectDetail={isObjectDetail}
      />
    );
  } else {
    return <span>{t`New chart`}</span>;
  }
};

export default QuestionDescription;
