import React from "react";
import { IndexRoute, IndexRedirect } from "react-router";
import { t } from "ttag";
import { routerActions } from "react-router-redux";
import { UserAuthWrapper } from "redux-auth-wrapper";

import { Route } from "metabase/hoc/Title";
import {
  PLUGIN_ADMIN_ROUTES,
  PLUGIN_ADMIN_USER_MENU_ROUTES,
  PLUGIN_ADMIN_TOOLS,
} from "metabase/plugins";

import { getSetting } from "metabase/selectors/settings";
import { withBackground } from "metabase/hoc/Background";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import {
  createAdminRouteGuard,
  createAdminRedirect,
} from "metabase/admin/utils";

// Permissions
import getAdminPermissionsRoutes from "metabase/admin/permissions/routes";

import LazyLoad from "metabase/routesLazyLoad";

const UserCanAccessTools = UserAuthWrapper({
  predicate: isEnabled => isEnabled,
  failureRedirectPath: "/admin",
  authSelector: state => {
    if (PLUGIN_ADMIN_TOOLS.EXTRA_ROUTES.length > 0) {
      return true;
    }
    const isModelPersistenceEnabled = getSetting(
      state,
      "persisted-models-enabled",
    );
    const hasLoadedSettings = typeof isModelPersistenceEnabled === "boolean";
    return !hasLoadedSettings || isModelPersistenceEnabled;
  },
  wrapperDisplayName: "UserCanAccessTools",
  allowRedirectBack: false,
  redirectAction: routerActions.replace,
});

const getRoutes = (store, CanAccessSettings, IsAdmin) => (
  <Route
    path="/admin"
    component={withBackground("bg-white")(CanAccessSettings)}
  >
    <Route title={t`Admin`} component={LazyLoad.AdminApp}>
      <IndexRoute component={LazyLoad.RedirectToAllowedSettings} />

      <Route
        path="databases"
        title={t`Databases`}
        component={createAdminRouteGuard("databases")}
      >
        <IndexRoute component={LazyLoad.DatabaseListApp} />
        <Route path="create" component={LazyLoad.DatabaseEditApp} />
        <Route path=":databaseId" component={LazyLoad.DatabaseEditApp} />
      </Route>

      <Route path="datamodel" component={createAdminRouteGuard("data-model")}>
        <Route title={t`Data Model`} component={LazyLoad.DataModelApp}>
          <IndexRedirect to="database" />
          <Route path="database" component={LazyLoad.MetadataEditorApp} />
          <Route path="database/:databaseId" component={LazyLoad.MetadataEditorApp} />
          <Route
            path="database/:databaseId/:mode"
            component={LazyLoad.MetadataEditorApp}
          />
          <Route
            path="database/:databaseId/:mode/:tableId"
            component={LazyLoad.MetadataEditorApp}
          />
          <Route
            path="database/:databaseId/:mode/:tableId/settings"
            component={LazyLoad.TableSettingsApp}
          />
          <Route path="database/:databaseId/:mode/:tableId/:fieldId">
            <IndexRedirect to="general" />
            <Route path=":section" component={LazyLoad.FieldApp} />
          </Route>
          <Route path="metrics" component={LazyLoad.MetricListApp} />
          <Route path="metric/create" component={LazyLoad.MetricApp} />
          <Route path="metric/:id" component={LazyLoad.MetricApp} />
          <Route path="segments" component={LazyLoad.SegmentListApp} />
          <Route path="segment/create" component={LazyLoad.SegmentApp} />
          <Route path="segment/:id" component={LazyLoad.SegmentApp} />
          <Route path=":entity/:id/revisions" component={LazyLoad.RevisionHistoryApp} />
        </Route>
      </Route>

      {/* PEOPLE */}
      <Route path="people" component={createAdminRouteGuard("people")}>
        <Route title={t`People`} component={LazyLoad.AdminPeopleApp}>
          <IndexRoute component={LazyLoad.PeopleListingApp} />

          {/*NOTE: this must come before the other routes otherwise it will be masked by them*/}
          <Route path="groups" title={t`Groups`}>
            <IndexRoute component={LazyLoad.GroupsListingApp} />
            <Route path=":groupId" component={LazyLoad.GroupDetailApp} />
          </Route>

          <Route path="" component={LazyLoad.PeopleListingApp}>
            <ModalRoute path="new" modal={LazyLoad.NewUserModal} />
          </Route>

          <Route path=":userId" component={LazyLoad.PeopleListingApp}>
            <ModalRoute path="edit" modal={LazyLoad.EditUserModal} />
            <ModalRoute path="success" modal={LazyLoad.UserSuccessModal} />
            <ModalRoute path="reset" modal={LazyLoad.UserPasswordResetModal} />
            <ModalRoute path="deactivate" modal={LazyLoad.UserActivationModal} />
            <ModalRoute path="reactivate" modal={LazyLoad.UserActivationModal} />
            {PLUGIN_ADMIN_USER_MENU_ROUTES.map(getRoutes => getRoutes(store))}
          </Route>
        </Route>
      </Route>

      {/* Troubleshooting */}
      <Route
        path="troubleshooting"
        component={createAdminRouteGuard("troubleshooting")}
      >
        <Route title={t`Troubleshooting`} component={LazyLoad.TroubleshootingApp}>
          <IndexRedirect to="help" />
          <Route path="help" component={LazyLoad.Help} />
          <Route path="tasks" component={LazyLoad.TasksApp}>
            <ModalRoute path=":taskId" modal={LazyLoad.TaskModal} />
          </Route>
          <Route path="jobs" component={LazyLoad.JobInfoApp}>
            <ModalRoute
              path=":jobKey"
              modal={LazyLoad.JobTriggersModal}
              modalProps={{ wide: true }}
            />
          </Route>
          <Route path="logs" component={LazyLoad.Logs} />
        </Route>
      </Route>

      {/* SETTINGS */}
      <Route path="settings" component={createAdminRouteGuard("settings")}>
        <IndexRoute component={createAdminRedirect("setup", "general")} />
        <Route title={t`Settings`}>
          <Route
            path="premium-embedding-license"
            component={LazyLoad.PremiumEmbeddingLicensePage}
          />
          <Route path="*" component={LazyLoad.SettingsEditorApp} />
        </Route>
      </Route>

      {/* PERMISSIONS */}
      <Route path="permissions" component={IsAdmin}>
        {getAdminPermissionsRoutes(store)}
      </Route>

      <Route
        path="tools"
        component={UserCanAccessTools(createAdminRouteGuard("tools"))}
      >
        <Route title={t`Tools`} component={LazyLoad.Tools}>
          <IndexRedirect to={PLUGIN_ADMIN_TOOLS.INDEX_ROUTE} />
          <Route
            path="model-caching"
            title={t`Model Caching Log`}
            component={LazyLoad.ModelCacheRefreshJobs}
          >
            <ModalRoute path=":jobId" modal={LazyLoad.ModelCacheRefreshJobModal} />
          </Route>
          {PLUGIN_ADMIN_TOOLS.EXTRA_ROUTES}
        </Route>
      </Route>

      {/* PLUGINS */}
      <React.Fragment>
        {PLUGIN_ADMIN_ROUTES.map(getRoutes => getRoutes(store))}
      </React.Fragment>
    </Route>
  </Route>
);

export default getRoutes;
