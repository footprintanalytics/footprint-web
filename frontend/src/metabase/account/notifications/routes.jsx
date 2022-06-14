import React from "react";
import { Route } from "metabase/hoc/Title";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import LazyLoad from "../../routesLazyLoad";

const getRoutes = () => (
  <Route path="notifications" component={LazyLoad.NotificationsApp}>
    <ModalRoute path="help" modal={LazyLoad.HelpModal} />
    <ModalRoute
      path="alert/:alertId/archive"
      modal={LazyLoad.ArchiveAlertModal}
    />
    <ModalRoute
      path="pulse/:pulseId/archive"
      modal={LazyLoad.ArchivePulseModal}
    />
    <ModalRoute
      path="alert/:alertId/unsubscribe"
      modal={LazyLoad.UnsubscribeAlertModal}
    />
    <ModalRoute
      path="pulse/:pulseId/unsubscribe"
      modal={LazyLoad.UnsubscribePulseModal}
    />
  </Route>
);

export default getRoutes;
