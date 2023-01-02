import React, { Fragment } from "react";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import LazyLoad from "metabase/routesLazyLoad";

const getRoutes = () => {
  return (
    <Fragment>
      <ModalRoute
        {...{
          path: "timelines",
          modal: LazyLoad.TimelineIndexModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/new",
          modal: LazyLoad.NewTimelineModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/archive",
          modal: LazyLoad.TimelineListArchiveModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId",
          modal: LazyLoad.TimelineDetailsModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/edit",
          modal: LazyLoad.EditTimelineModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/move",
          modal: LazyLoad.MoveTimelineModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/archive",
          modal: LazyLoad.TimelineArchiveModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/delete",
          modal: LazyLoad.DeleteTimelineModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/new/events/new",
          modal: LazyLoad.NewEventWithTimelineModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/events/new",
          modal: LazyLoad.NewEventModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/events/:timelineEventId/edit",
          modal: LazyLoad.EditEventModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/events/:timelineEventId/move",
          modal: LazyLoad.MoveEventModal,
          modalProps: { enableTransition: false },
        }}
      />
      <ModalRoute
        {...{
          path: "timelines/:timelineId/events/:timelineEventId/delete",
          modal: LazyLoad.DeleteEventModal,
          modalProps: { enableTransition: false },
        }}
      />
    </Fragment>
  );
};

export default getRoutes;
