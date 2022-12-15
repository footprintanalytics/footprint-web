import axios from "axios";
import { debounce } from "underscore";
import { isDev, slackUrl } from "metabase/env";

export const slack = debounce(async list => {
  let text = "```";
  list.forEach(item => (text += `【${item.label}】${item.value}\n`));
  text += "```";

  if (isDev) {
    console.log(`[SLACK_PUSH] ${text}`);
    return;
  }

  await axios.post(slackUrl, JSON.stringify({ text }), {
    withCredentials: false,
    transformRequest: [
      (data, headers) => {
        delete headers.common.Authorization;
        delete headers.post["Content-Type"];
        return data;
      },
    ],
  });
}, 5000);
