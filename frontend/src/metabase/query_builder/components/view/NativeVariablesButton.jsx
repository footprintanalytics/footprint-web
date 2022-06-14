/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/components/Button";

const NativeVariablesButton = ({
  toggleTemplateTagsEditor,
  isShowingTemplateTagsEditor,
}) => (
  <Tooltip tooltip={t`Variables`}>
    <Button
      className={`ml1 Question-header-btn ${
        isShowingTemplateTagsEditor ? "Question-header-btn--primary" : ""
      }`}
      iconColor="#7A819B"
      icon="variable"
      iconSize={16}
      onClick={toggleTemplateTagsEditor}
    />
  </Tooltip>
);

export default NativeVariablesButton;
