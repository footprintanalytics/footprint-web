import React from "react";

import { t } from "ttag";
import { Route } from "metabase/hoc/Title";

import { trackPageView } from "metabase/lib/analytics";
import LazyLoad from "./routesLazyLoad";
import { IndexRoute } from "react-router";

export const getRoutes = store => (
  <Route
    title={t`Footprint Analytics | Web3 Data Solution Provider with AI technology. `}
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
      <Route path="research" >
        <IndexRoute
          component={props => <LazyLoad.Research {...props} classify="nft" />}
        />
        <Route
          path="nft"
          component={props => <LazyLoad.Research {...props} classify="nft" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="gamefi"
          component={props => (
            <LazyLoad.Research {...props} classify="gamefi" />
          )}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="chain"
          component={props => <LazyLoad.Research {...props} classify="chain" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="token"
          component={props => <LazyLoad.Research {...props} classify="token" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="wallet"
          component={props => <LazyLoad.Research {...props} classify="wallet" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="custom/:partner"
          component={props => <LazyLoad.Research {...props} classify="custom" />}
        >
          <Route path=":menu(/:subMenu)" />
        </Route>
      </Route>
      <Route path="widget/chart/:uuid" component={LazyLoad.WidgetPublic} />
      <Route path="widget/brand" component={LazyLoad.WidgetBrand} />
      <Route title={t`Explore`} path="explore" component={LazyLoad.Explore} />
      <Route path="*" component={LazyLoad.PublicNotFound} />
    </Route>
    <Route path="*" component={LazyLoad.PublicNotFound} />
  </Route>
);
