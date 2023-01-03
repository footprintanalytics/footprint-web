import React from "react";
import { Timeline, TimelineEvent, User } from "metabase-types/api";
import TimelineCard from "metabase/timelines/questions/components/TimelineCard/TimelineCard";

export interface TimelineListProps {
  timelines: Timeline[];
  visibleTimelineIds?: number[];
  selectedEventIds?: number[];
  onEditEvent?: (event: TimelineEvent) => void;
  onMoveEvent?: (event: TimelineEvent) => void;
  onArchiveEvent?: (event: TimelineEvent) => void;
  onToggleEvent?: (event: TimelineEvent, isSelected: boolean) => void;
  onToggleTimeline?: (timeline: Timeline, isVisible: boolean) => void;
  user?: User,
}

const TimelineList = ({
  timelines,
  visibleTimelineIds = [],
  selectedEventIds = [],
  onEditEvent,
  onMoveEvent,
  onArchiveEvent,
  onToggleEvent,
  onToggleTimeline,
  user,
}: TimelineListProps): JSX.Element => {
  return (
    <div>
      {timelines.map(timeline => (
        <TimelineCard
          key={timeline.id}
          timeline={timeline}
          isDefault={timelines.length === 1}
          isVisible={visibleTimelineIds.includes(timeline.id)}
          selectedEventIds={selectedEventIds}
          onToggleTimeline={onToggleTimeline}
          onEditEvent={onEditEvent}
          onMoveEvent={onMoveEvent}
          onToggleEvent={onToggleEvent}
          onArchiveEvent={onArchiveEvent}
          user={user}
        />
      ))}
    </div>
  );
};

export default TimelineList;
