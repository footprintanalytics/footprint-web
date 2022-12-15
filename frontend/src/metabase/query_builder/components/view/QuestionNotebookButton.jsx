/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import cx from "classnames";

import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { HeaderButton } from "./ViewHeader.styled";

export default function QuestionNotebookButton({
  className,
  question,
  isShowingNotebook,
  setQueryBuilderMode,
  ...props
}) {
  return (
    <Tooltip
      tooltip={isShowingNotebook ? t`Hide editor` : t`Show editor`}
      placement="bottom"
    >
      <HeaderButton
        primary={isShowingNotebook}
        className={cx(className, isShowingNotebook ? undefined : "text-dark", {
          "text-brand-hover": !isShowingNotebook,
        })}
        icon="advanced"
        onClick={() =>
          setQueryBuilderMode(isShowingNotebook ? "view" : "notebook")
        }
        {...props}
      >
        {t`Advanced`}
      </HeaderButton>
    </Tooltip>
  );
}

QuestionNotebookButton.shouldRender = ({ question, isActionListVisible }) =>
  question.isStructured() &&
  question.query().isEditable() &&
  isActionListVisible;
