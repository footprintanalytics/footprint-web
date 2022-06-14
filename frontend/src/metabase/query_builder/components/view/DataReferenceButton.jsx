/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/components/Button";

const DataReferenceButton = ({
  isShowingDataReference,
  toggleDataReference,
}) => (
  <Tooltip tooltip={t`Learn about your data`}>
    <Button
      className={`ml1 Question-header-btn ${
        isShowingDataReference ? "Question-header-btn--primary" : ""
      }`}
      iconColor="#7A819B"
      icon="reference"
      iconSize={18}
      onClick={toggleDataReference}
    />
  </Tooltip>
);

export default DataReferenceButton;
