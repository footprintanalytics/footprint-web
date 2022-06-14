import { loadCard, utf8_to_b64url } from "metabase/lib/card";
import { guestUrl } from "metabase/lib/urls";
import querystring from "querystring";
import { message } from "antd";
import { unset } from "lodash";
import * as Urls from "metabase/lib/urls";

export function navigateToGuestQuery(
  { dashcard },
  { parameters, parameterValues, dashboardId, user },
) {
  const { parameter_mappings, public_uuid, card } = dashcard;
  const key = utf8_to_b64url(
    JSON.stringify({
      parameters: parameters.map(item => {
        const _item = { ...item };
        delete _item.fields;
        return _item;
      }),
      parameterValues,
      parameter_mappings,
      dashboardUuid: dashboardId,
    }),
  );
  const path = guestUrl({
    type: "chart",
    publicUuid: public_uuid,
    name: card.name,
  });
  let oldOptions = {};
  if (location.hash) {
    const oldHash = location.hash.replace(/^#/, "");
    oldOptions = querystring.parse(oldHash);
  }
  const hashOptions = {
    ...oldOptions,
    key,
  };
  const url = `${path}#${querystring.stringify(hashOptions)}`;
  // onChangeLocation(url);
  window.open(url);
}

export async function replaceTemplateCardUrl(props, cardId) {
  const { user, setLoginModalShow } = props;
  if (!user) {
    setLoginModalShow({ show: true, from: "dashcard_preview" });
    return;
  }
  const hide = message.loading("Loading...", 0);
  const card = await loadCard(cardId);
  hide();
  unset(card, ["visualization_settings", "card.title"]);
  window.open(Urls.newQuestion({ ...card, create_method: "preview" }));
}
