import React from "react";

import { IndexRoute, IndexRedirect } from "react-router";
import { t } from "ttag";
import _ from "underscore";
import { Route } from "metabase/hoc/Title";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import { createAdminRouteGuard } from "metabase/admin/utils";
import LazyLoad from "metabase/routesLazyLoad";

function getPageRoutes(path, page) {
  const subRoutes = [];
  // add a redirect for the default tab
  const defaultTab = getDefaultTab(page);
  if (defaultTab) {
    subRoutes.push(
      <IndexRedirect key={defaultTab.path} to={defaultTab.path} />,
    );
  }
  // add sub routes for each tab
  if (page.tabs) {
    subRoutes.push(
      ...page.tabs.map(tab => (
        <Route key={tab.path} path={tab.path} component={tab.component}>
          {tab.modals &&
            tab.modals.map(modal => (
              <ModalRoute
                key={modal.path}
                path={modal.path}
                modal={modal.modal}
              />
            ))}
        </Route>
      )),
    );
  }
  // if path is provided, use that, otherwise use an IndexRoute
  return path ? (
    <Route path={path} component={page}>
      {subRoutes}
    </Route>
  ) : (
    <IndexRoute component={page}>{subRoutes}</IndexRoute>
  );
}

function getDefaultTab(page) {
  // use the tab with "default = true" or the first
  return (
    _.findWhere(page.tabs, { default: true }) ||
    (page.tabs && page.tabs[0]) ||
    null
  );
}

const getRoutes = store => (
  <Route
    key="audit"
    path="audit"
    title={t`Audit`}
    component={createAdminRouteGuard("audit", LazyLoad.AuditApp)}
  >
    {/* <IndexRedirect to="overview" /> */}
    <IndexRedirect to="members" />

    <Route path="overview" component={LazyLoad.AuditOverview} />

    {getPageRoutes("databases", LazyLoad.AuditDatabases)}
    {getPageRoutes("database/:databaseId", LazyLoad.AuditDatabaseDetail)}
    {getPageRoutes("schemas", LazyLoad.AuditSchemas)}
    {getPageRoutes("schema/:schemaId", LazyLoad.AuditSchemaDetail)}
    {getPageRoutes("tables", LazyLoad.AuditTables)}
    {getPageRoutes("table/:tableId", LazyLoad.AuditTableDetail)}
    {getPageRoutes("dashboards", LazyLoad.AuditDashboards)}
    {getPageRoutes("dashboard/:dashboardId", LazyLoad.AuditDashboardDetail)}
    {getPageRoutes("questions", LazyLoad.AuditQuestions)}
    {getPageRoutes("question/:questionId", LazyLoad.AuditQuestionDetail)}
    {getPageRoutes("query/:queryHash", LazyLoad.AuditQueryDetail)}
    {getPageRoutes("downloads", LazyLoad.AuditDownloads)}
    {getPageRoutes("members", LazyLoad.AuditUsers)}
    {getPageRoutes("member/:userId", LazyLoad.AuditUserDetail)}
    {getPageRoutes("subscriptions", LazyLoad.AuditSubscriptions)}
  </Route>
);

export const getUserMenuRotes = () => (
  <ModalRoute path="unsubscribe" modal={LazyLoad.UnsubscribeUserModal} />
);

export default getRoutes;
