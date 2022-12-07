import slugg from "slugg";

import { stringifyHashOptions } from "metabase/lib/browser";
import MetabaseSettings from "metabase/lib/settings";

import { CollectionId, Dashboard } from "metabase-types/api";

import { appendSlug, publicUrl } from "./utils";
import { optionsToHashParams } from "metabase/public/lib/embed";

import { get } from "lodash";

export const newDashboard = (collectionId: CollectionId) =>
  `collection/${collectionId}/new_dashboard`;

type DashboardUrlBuilderOpts = {
  addCardWithId?: number;
  editMode?: boolean;
};

export function dashboard(
  dashboard: Dashboard,
  { addCardWithId, editMode }: DashboardUrlBuilderOpts = {},
) {
  const options = {
    ...(addCardWithId ? { add: addCardWithId } : {}),
    ...(editMode ? { edit: editMode } : {}),
  };
  const userName = get(dashboard, "creator.name");
  const dashboardName =
    get(dashboard, "uniqueName") || get(dashboard, "unique_name");
  let path: string = "";
  if (userName && dashboardName) {
    return dashboardUrl(dashboard);
  } else {
    path = appendSlug(dashboard.id, slugg(dashboard.name));
    const hash = stringifyHashOptions(options);
    return hash ? `/dashboard/${path}#${hash}` : `/dashboard/${path}`;
  }
}

export function dashboardUrl({ creator, uniqueName, unique_name } : Dashboard) {
  const userName = get(creator, "name");
  const dashboardName = uniqueName || unique_name;
  return `@${userName}/${dashboardName}`;
}

export function publicDashboardOrigin(uuid: string) {
  const siteUrl = MetabaseSettings.get("site-url");
  return `${siteUrl}/public/dashboard/${uuid}`;
}

export function embedDashboard(token: string) {
  const siteUrl = MetabaseSettings.get("site-url");
  return `${siteUrl}/embed/dashboard/${token}`;
}

interface publicDashboardType {
  uuid: string,
  name: string,
  search: string,
  options: any,
}

export function publicDashboard({ uuid, name, search = "", options = null }: publicDashboardType) {
  const siteUrl = MetabaseSettings.get("site-url");

  return `${siteUrl}/${publicUrl({
    publicUuid: uuid,
    name,
    type: "dashboard",
  })}${search}${optionsToHashParams(options)}`;
}

interface guestDashboardType {
  uuid: string,
  name: string,
  search: string,
  uniqueName: string,
  options: any,
  creator: any,
}

export function guestDashboard({
   uuid,
   name,
   search = "",
   options = null,
   uniqueName,
   creator,
 }: guestDashboardType) {
  const siteUrl = `${MetabaseSettings.get("site-url")}`;
  // @ts-ignore
  return `${siteUrl}/${dashboardUrl({
    creator,
    uniqueName,
  })}${search}${optionsToHashParams(options)}`;
}
