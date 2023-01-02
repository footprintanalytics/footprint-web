import React from "react";

import { t } from "ttag";
import { Route } from "metabase/hoc/Title";

import { trackPageView } from "metabase/lib/analytics";
import LazyLoad from "./routesLazyLoad";

export const getRoutes = store => (
  <Route
    title={t`Footprint Analytics`}
    onEnter={nextState => {
      trackPageView(nextState.location.pathname, "Enter");
    }}
    onChange={(prevState, nextState) => {
      trackPageView(nextState.location.pathname, "Change");
    }}
  >
    <Route path="public" component={LazyLoad.PublicApp}>
      <Route
        path="question/:uuid(/:name)"
        component={LazyLoad.PublicQuestion}
      />
      <Route path="chart/:titleAndId" component={LazyLoad.PublicQuestion} />
      <Route
        path="dashboard/:uuid(/:name)"
        component={LazyLoad.PublicDashboard}
      />
      <Route
        path="scene/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        path="scene/dashboard/:uuid(/:name)"
        component={LazyLoad.PublicDashboard}
      />
      <Route
        path="wl/dashboard/:uuid(/:name)"
        component={LazyLoad.PublicDashboard}
      />
      <Route path="widget/chart/:uuid" component={LazyLoad.WidgetPublic} />
      <Route path="widget/brand" component={LazyLoad.WidgetBrand} />
      <Route title={t`Explore`} path="explore" component={LazyLoad.Explore} />
      <Route path="*" component={LazyLoad.PublicNotFound} />
    </Route>
    <Route path="*" component={LazyLoad.PublicNotFound} />
  </Route>
);
