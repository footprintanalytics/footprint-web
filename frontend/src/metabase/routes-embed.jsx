import React from "react";
import { Route } from "react-router";
import LazyLoad from "./routesLazyLoad";

export const getRoutes = store => (
  <Route>
    <Route path="embed" component={LazyLoad.PublicApp}>
      <Route path="question/:token" component={LazyLoad.PublicQuestion} />
      <Route path="dashboard/:token" component={LazyLoad.PublicDashboard} />
      <Route path="*" component={LazyLoad.PublicNotFound} />
    </Route>
    <Route path="*" component={LazyLoad.PublicNotFound} />
  </Route>
);
