/* eslint-disable no-undef */
import { message } from "antd";
import { isDev } from "metabase/env";
// import { slack } from "metabase/lib/slack";

export const snapshot = ({ public_uuid, isDashboard = true, user }) => {
  const hide = message.loading(
    "Taking a screenshot, this may take some time...",
    2000,
  );
  setTimeout(() => {
    hide();
    let { hash, search } = window.location;

    const host = isDev ? process.env.ALPHA_URL : location.origin;
    const type = isDashboard ? "dashboard" : "chart";
    const api = isDashboard ? "shareDashboard" : "shareCard";

    const { name, twitter, telegram, discord, avatar } = user;
    const userSocial =
      "userSocial=" +
      encodeURIComponent(
        JSON.stringify({ name, twitter, telegram, discord, avatar }),
      );

    search += (search.includes("?") ? "&" : "?") + userSocial;

    const fpUrl =
      `${host}/guest/${type}/${public_uuid}` +
      encodeURIComponent(search) +
      encodeURIComponent(hash);
    const url = `${host}/api/v1/screenshot/${api}?websiteUrl=${fpUrl}`;

    console.log(url);
    window.open(url);

    // slack([
    //   { label: "Snapshot", value: url },
    //   {
    //     label: "User Social",
    //     value: JSON.stringify({ name, twitter, telegram, discord, avatar }),
    //   },
    // ]);
  }, 2000);
};
