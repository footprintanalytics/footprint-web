/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/components/Button";

const SnippetSidebarButton = ({
  toggleSnippetSidebar,
  isShowingSnippetSidebar,
}) => (
  <Tooltip tooltip={t`SQL Snippets`}>
    <Button
      className={`ml1 Question-header-btn ${
        isShowingSnippetSidebar ? "Question-header-btn--primary" : ""
      }`}
      iconColor="#7A819B"
      icon="snippet"
      iconSize={16}
      onClick={toggleSnippetSidebar}
    />
  </Tooltip>
);

export default SnippetSidebarButton;
