import React from "react";
import { IndexRedirect } from "react-router";
import { t } from "ttag";
import LazyLoad from "metabase/routesLazyLoad";
import { Route } from "metabase/hoc/Title";

import {
  PLUGIN_ADMIN_PERMISSIONS_TABLE_ROUTES,
  PLUGIN_ADMIN_PERMISSIONS_TABLE_GROUP_ROUTES,
  PLUGIN_APPLICATION_PERMISSIONS,
} from "metabase/plugins";


const getRoutes = () => (
  <Route title={t`Permissions`}>
    <IndexRedirect to="data" />

    <Route path="data" component={LazyLoad.DataPermissionsPage}>
      <IndexRedirect to="group" />

      <Route
        path="database(/:databaseId)(/schema/:schemaName)(/table/:tableId)"
        component={LazyLoad.DatabasesPermissionsPage}
      >
        {PLUGIN_ADMIN_PERMISSIONS_TABLE_GROUP_ROUTES}
      </Route>

      <Route
        path="group(/:groupId)(/database/:databaseId)(/schema/:schemaName)"
        component={LazyLoad.GroupsPermissionsPage}
      >
        {PLUGIN_ADMIN_PERMISSIONS_TABLE_ROUTES}
      </Route>
    </Route>

    <Route path="collections" component={LazyLoad.CollectionPermissionsPage}>
      <Route path=":collectionId" />
    </Route>

    {PLUGIN_APPLICATION_PERMISSIONS.getRoutes()}
  </Route>
);

export default getRoutes;
