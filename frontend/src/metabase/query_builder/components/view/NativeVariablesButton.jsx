/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import cx from "classnames";

import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import NativeQuery from "metabase-lib/queries/NativeQuery";
import Button from "metabase/core/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";

const NativeVariablesButton = ({
  toggleTemplateTagsEditor,
  isShowingTemplateTagsEditor,
  className,
  size,
}) => (
  <Tooltip tooltip={t`Variables`}>
    <Button
      className={cx(className, "Question-header-btn transition-color text-brand-hover", {
        "Question-header-btn--primary": isShowingTemplateTagsEditor,
      })}
      iconColor="#7A819B"
      icon="variable"
      iconSize={size}
      onClick={() => {
        trackStructEvent("NativeVariablesButton")
        toggleTemplateTagsEditor()
      }}
    />
  </Tooltip>
);

NativeVariablesButton.shouldRender = ({ question }) =>
  question.query() instanceof NativeQuery &&
  question.database() &&
  question.database().hasFeature("native-parameters");

export default NativeVariablesButton;
