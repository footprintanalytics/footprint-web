/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { t } from "ttag";
import cx from "classnames";
import Button from "metabase/core/components/Button";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import { MODAL_TYPES } from "metabase/query_builder/constants";
import QuestionEmbedWidget from "../containers/QuestionEmbedWidget";
import { QuestionEmbedWidgetButton } from "./view/ViewHeader";
import Tooltip from "../../components/Tooltip";
import { trackStructEvent } from "../../lib/analytics";

const QueryMoreWidget = ({
  className,
  classNameClose,
  isAdmin,
  isOwner,
  isInner,
  onOpenModal,
  setShowSeoTagging,
  card,
  user,
  question,
  downloadImageAction,
}) => {
  if (!isOwner && !isAdmin && !isInner) {
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
          {(isOwner || isAdmin) && (
            <div style={{ width: "100%"}}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                iconColor="#7A819B"
                icon="pencil"
                iconSize={16}
                onClick={() => onOpenModal(MODAL_TYPES.EDIT)}
              >{t`Edit description`}</Button>
            </div>
          )}
          {(!!card.public_uuid || isOwner) && QuestionEmbedWidget.shouldRender({
            question,
            isAdmin,
            user,
          }) && (
            <div style={{ width: "100%"}}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                icon="embed"
                iconSize={16}
                onClick={() => {
                  trackStructEvent(
                  "Sharing / Embedding",
                  "question",
                  "Sharing Link Clicked",
                  );
                  onOpenModal("embed", null, { onlyEmbed: true });
                }}
              >Embed widget</Button>
            </div>
          )}
          {(!!card.public_uuid || isOwner || isAdmin) && (
            <div style={{ width: "100%"}}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                iconColor="#7A819B"
                icon="camera"
                iconSize={16}
                onClick={downloadImageAction}
              >Snapshot</Button>
            </div>
          )}
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
          {(isAdmin || isInner) && (
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
          {(isOwner || isAdmin) && (
            <div style={{ width: "100%" }}>
              <Button
                className="Question-header-btn Question-header-btn--full"
                iconColor="#7A819B"
                icon="archive"
                iconSize={16}
                onClick={() => onOpenModal(MODAL_TYPES.ARCHIVE)}
              >{t`Delete`}</Button>
            </div>
          )}
        </div>
      </div>
    </PopoverWithTrigger>
  );
};

export default QueryMoreWidget;
