/* eslint-disable react/prop-types */
import React from "react";
import Icon from "metabase/components/Icon";
import "./QuestionStudioBack.css";
import Link from "metabase/core/components/Link";

const QuestionStudioBack = props => {
  const {
    title
  } = props;
  return (
    <div className="question-studio__back" onClick={() => console.log("bb")}>
      <Link className="question-studio__back-left" to="/studio">
        <Icon name="collapse_arrow_left" size={16}/>
        <span className="footprint-primary-text">Back</span>
      </Link>
      <div className="question__vertical-line"/>
      <div className="question-studio__back-right">
        <h3 className="footprint-primary-text">{title}</h3>
      </div>
    </div>
  )
};

export default QuestionStudioBack;
