import React from "react";
import { t } from "ttag";
import { IndexRedirect } from "react-router";
import { Route } from "metabase/hoc/Title";
import LazyLoad from "../routesLazyLoad";
import getNotificationRoutes from "./notifications/routes";

const getRoutes = (store, IsAuthenticated) => {
  return (
    <Route path="account" component={IsAuthenticated}>
      <Route
        title={t`Account settings`}
        component={LazyLoad.AccountSettingsApp}
      >
        <IndexRedirect to="profile" />
        <Route path="profile" component={LazyLoad.UserProfileApp} />
        <Route path="password" component={LazyLoad.UserPasswordApp} />
        <Route path="developer" component={LazyLoad.DeveloperApp} />
        <Route path="login-history" component={LazyLoad.LoginHistoryApp} />
        {getNotificationRoutes()}
      </Route>
    </Route>
  );
};

export default getRoutes;
