import React from "react";
import { Route } from "metabase/hoc/Title";
import { IndexRoute, IndexRedirect } from "react-router";
import { t } from "ttag";

import {
  PLUGIN_ADMIN_ROUTES,
  PLUGIN_ADMIN_USER_MENU_ROUTES,
} from "metabase/plugins";

import { withBackground } from "metabase/hoc/Background";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import LazyLoad from "../routesLazyLoad";
import getAdminPermissionsRoutes from "metabase/admin/permissions/routes";

const getRoutes = (store, IsAdmin) => (
  <Route
    path="/admin"
    title={t`Admin`}
    component={withBackground("bg-white")(IsAdmin)}
  >
    <IndexRedirect to="settings" />

    <Route path="databases" title={t`Databases`}>
      <IndexRoute component={LazyLoad.DatabaseListApp} />
      <Route path="create" component={LazyLoad.DatabaseEditApp} />
      <Route path=":databaseId" component={LazyLoad.DatabaseEditApp} />
    </Route>

    <Route
      path="datamodel"
      title={t`Data Model`}
      component={LazyLoad.DataModelApp}
    >
      <IndexRedirect to="database" />
      <Route path="database" component={LazyLoad.MetadataEditorApp} />
      <Route
        path="database/:databaseId"
        component={LazyLoad.MetadataEditorApp}
      />
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
      <Route
        path=":entity/:id/revisions"
        component={LazyLoad.RevisionHistoryApp}
      />
    </Route>

    {/* PEOPLE */}
    <Route path="people" title={t`People`} component={LazyLoad.AdminPeopleApp}>
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

    {/* Troubleshooting */}
    <Route
      path="troubleshooting"
      title={t`Troubleshooting`}
      component={LazyLoad.TroubleshootingApp}
    >
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

    {/* SETTINGS */}
    <Route path="settings" title={t`Settings`}>
      <IndexRedirect to="setup" />
      <Route path="*" component={LazyLoad.SettingsEditorApp} />
    </Route>

    {/* PERMISSIONS */}
    <React.Fragment>{getAdminPermissionsRoutes(store)}</React.Fragment>

    {/* PLUGINS */}
    <React.Fragment>
      {PLUGIN_ADMIN_ROUTES.map(getRoutes => getRoutes(store))}
    </React.Fragment>
  </Route>
);

export default getRoutes;
