/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { Box } from "grid-styled";
import Button from "metabase/components/Button";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import cx from "classnames";
import { t } from "ttag";
import { MODAL_TYPES } from "metabase/query_builder/constants";

const QueryMoreWidget = ({
  className,
  classNameClose,
  isAdmin,
  isOwner,
  onOpenModal,
  setShowSeoTagging,
}) => {
  if (!isOwner && !isAdmin) {
    return null;
  }

  return (
    <PopoverWithTrigger
      triggerElement={
        <Button
          onlyIcon
          className="Question-header-btn"
          iconColor="#7A819B"
          icon="more"
          iconSize={16}
        />
      }
      triggerClasses={cx(className, "text-brand-hover")}
      triggerClassesClose={classNameClose}
    >
      <Box p={2} w={260}>
        <Box>
          <Box w={"100%"}>
            <Button
              className="Question-header-btn Question-header-btn--full"
              iconColor="#7A819B"
              icon="pencil"
              iconSize={16}
              onClick={() => onOpenModal(MODAL_TYPES.EDIT)}
            >{t`Edit details`}</Button>
          </Box>
          <Box w={"100%"}>
            <Button
              className="Question-header-btn Question-header-btn--full"
              iconColor="#7A819B"
              icon="add_to_dash"
              iconSize={16}
              onClick={() => onOpenModal(MODAL_TYPES.ADD_TO_DASHBOARD)}
            >{t`Add to dashboard`}</Button>
          </Box>
          {isAdmin && (
            <Box w={"100%"}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                icon="data_update"
                onClick={() => {
                  setShowSeoTagging();
                }}
              >
                Seo tagging
              </Button>
            </Box>
          )}
          {isAdmin && (
            <Box w={"100%"}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                iconColor="#7A819B"
                icon="move"
                iconSize={16}
                onClick={() => onOpenModal(MODAL_TYPES.MOVE)}
              >{t`Move`}</Button>
            </Box>
          )}
          {/* <Box w={"100%"}>
          <Button
            className="Question-header-btn Question-header-btn--full"
            iconColor="#7A819B"
            icon="segment"
            iconSize={16}
            onClick={() => onOpenModal(MODAL_TYPES.CLONE)}
          >{t`Duplicate this query`}</Button>
        </Box> */}
          <Box w={"100%"}>
            <Button
              className="Question-header-btn Question-header-btn--full"
              iconColor="#7A819B"
              icon="archive"
              iconSize={16}
              onClick={() => onOpenModal(MODAL_TYPES.ARCHIVE)}
            >{t`Delete`}</Button>
          </Box>
        </Box>
      </Box>
    </PopoverWithTrigger>
  );
};

export default QueryMoreWidget;
