import { unset } from "lodash";
import querystring from "querystring";
import { message, Modal } from "antd";
import { loadCardForPreview } from "metabase/lib/card";
import { utf8_to_b64url } from "metabase/lib/encoding";
import { guestUrl } from "metabase/lib/urls";
import * as Urls from "metabase/lib/urls";
import { DashboardApi } from "metabase/services";
import copy from 'copy-to-clipboard';
import { trackStructEvent } from "metabase/lib/analytics";

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
  const url = `${path}`;
  // const url = `${path}#${querystring.stringify(hashOptions)}`;
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
  const card = await loadCardForPreview(cardId);
  hide();
  unset(card, ["visualization_settings", "card.title"]);
  window.open(Urls.newQuestion({ ...card, create_method: "preview" }));
}

export async function getSqlAndJumpToDoc(props, { cardId, dashcardId, dashboardId }) {
  const { user, setLoginModalShow } = props;
  if (!user) {
    setLoginModalShow({ show: true, from: "dashcard_preview" });
    return;
  }
  trackStructEvent(`dashcard getSqlAndJumpToDoc`);
  const hide = message.loading("Loading...", 0);
  const result = await DashboardApi.cardQuerySQL({
    "dashboardId": dashboardId,
    "dashcardId": dashcardId,
    "cardId": cardId,
  });
  hide();
  // const showGetChartDataViaSqlApi = !localStorage.getItem("showGetChartDataViaSqlApi");
  if (result?.query) {
    // if (showGetChartDataViaSqlApi) {
    //   localStorage.setItem("showGetChartDataViaSqlApi", "true");
    trackStructEvent(`dashcard getSqlAndJumpToDoc Modal`);
      Modal.confirm({
        title: 'How to get this data via SQL API?',
        content: "1. Click the button 'Get chart data' and copy SQL query\n2. Paste the query into the BODY PARAMS on the next page",
        okText: 'Get chart data',
        cancelText: 'Cancel',
        onOk: () => {
          trackStructEvent(`dashcard getSqlAndJumpToDoc Modal-ok`);
          copyToDoc(result?.query)
        },
      })
    // } else {
    //   copyToDoc(result?.query)
    // }
  }
}

const copyToDoc = (query) => {
  copy(query);
  message.success("Chart SQL already copied.")
  setTimeout(() => {
    window.open("https://docs.footprint.network/reference/post_native");
  }, 1000)
}
