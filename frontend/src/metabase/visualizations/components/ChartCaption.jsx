import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { iconPropTypes } from "metabase/components/Icon";
import { ChartCaptionRoot } from "./ChartCaption.styled";
import { Tag } from "antd";

const propTypes = {
  series: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  icon: PropTypes.shape(iconPropTypes),
  actionButtons: PropTypes.node,
  onChangeCardAndRun: PropTypes.func,
  titleExtraInfo: PropTypes.string,
};

const ChartCaption = ({
  series,
  settings,
  icon,
  actionButtons,
  onChangeCardAndRun,
  titleExtraInfo,
}) => {
  const title = settings["card.title"] ?? series[0].card.name;
  const description = settings["card.description"];
  const data = series._raw || series;
  const card = data[0].card;
  const cardIds = new Set(data.map(s => s.card.id));
  const canSelectTitle = cardIds.size === 1 && onChangeCardAndRun;

  const handleSelectTitle = useCallback(() => {
    onChangeCardAndRun({
      nextCard: card,
      seriesIndex: 0,
    });
  }, [card, onChangeCardAndRun]);

  if (!title) {
    return null;
  }

  return (
    <div className="flex align-center">
      {titleExtraInfo && <Tag style={{ marginRight: 0, padding: "0 4px" }}>{titleExtraInfo}</Tag>}
      <ChartCaptionRoot
        title={title}
        description={description}
        icon={icon}
        actionButtons={actionButtons}
        onSelectTitle={canSelectTitle ? handleSelectTitle : undefined}
      />
    </div>
  );
};

ChartCaption.propTypes = propTypes;

export default ChartCaption;
