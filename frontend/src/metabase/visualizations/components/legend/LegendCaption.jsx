/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import Ellipsified from "metabase/components/Ellipsified";
import LegendActions from "./LegendActions";
import {
  LegendCaptionRoot,
  LegendDescriptionIcon,
  LegendLabel,
  LegendLabelIcon,
} from "./LegendCaption.styled";
import { guestUrl } from "metabase/lib/urls";
import Link from "metabase/components/Link";

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.shape(iconPropTypes),
  actionButtons: PropTypes.node,
  onSelectTitle: PropTypes.func,
};

const LegendCaption = ({
  className,
  title,
  description,
  icon,
  actionButtons,
  onSelectTitle,
  dashcard,
}) => {
  const [url, setUrl] = useState();

  useEffect(() => {
    if (!dashcard) return;
    const { public_uuid: publicUuid, card } = dashcard;
    if (!publicUuid) return;
    const res = guestUrl({ type: "chart", cardId: card.id, name: card.name });
    setUrl(res);
  }, [dashcard]);

  const Title = () => {
    return (
      <LegendLabel
        className="fullscreen-normal-text fullscreen-night-text"
        // onClick={onSelectTitle}
      >
        <Ellipsified style={{ maxWidth: "80%" }} className="LegendLabel">
          {title}
        </Ellipsified>
      </LegendLabel>
    );
  };

  return (
    <LegendCaptionRoot className={className} data-testid="legend-caption">
      {icon && <LegendLabelIcon {...icon} />}
      {url ? (
        <Link href={url} target="_blank" style={{ width: "100%" }}>
          <Title />
        </Link>
      ) : (
        <Title />
      )}
      {description && (
        <Tooltip tooltip={description} maxWidth="22em">
          <LegendDescriptionIcon className="hover-child" />
        </Tooltip>
      )}
      {actionButtons && <LegendActions>{actionButtons}</LegendActions>}
    </LegendCaptionRoot>
  );
};

LegendCaption.propTypes = propTypes;

export default LegendCaption;
