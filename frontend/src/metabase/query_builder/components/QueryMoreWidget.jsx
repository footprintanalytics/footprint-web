/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { t } from "ttag";
import cx from "classnames";
import Button from "metabase/core/components/Button";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
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
      <div className="p2" style={{ width: 260 }}>
        <div>
          <div style={{ width: "100%"}}>
            <Button
              className="Question-header-btn Question-header-btn--full"
              iconColor="#7A819B"
              icon="pencil"
              iconSize={16}
              onClick={() => onOpenModal(MODAL_TYPES.EDIT)}
            >{t`Edit details`}</Button>
          </div>
          <div style={{ width: "100%"}}>
            <Button
              className="Question-header-btn Question-header-btn--full"
              iconColor="#7A819B"
              icon="add_to_dash"
              iconSize={16}
              onClick={() => onOpenModal(MODAL_TYPES.ADD_TO_DASHBOARD)}
            >{t`Add to dashboard`}</Button>
          </div>
          {isAdmin && (
            <div style={{ width: "100%"}}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                icon="data_update"
                onClick={() => {
                  setShowSeoTagging();
                }}
              >
                Seo tagging
              </Button>
            </div>
          )}
          {isAdmin && (
            <div style={{ width: "100%"}}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                iconColor="#7A819B"
                icon="move"
                iconSize={16}
                onClick={() => onOpenModal(MODAL_TYPES.MOVE)}
              >{t`Move`}</Button>
            </div>
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
        </div>
      </div>
    </PopoverWithTrigger>
  );
};

export default QueryMoreWidget;
