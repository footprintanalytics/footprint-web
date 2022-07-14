/* eslint-disable curly */
/* eslint-env node */
import BrowserLogger from "alife-logger";
import { isProduction, armsPid } from "metabase/env";

let logger = null;
// const production = process.env.NODE_ENV === "production";

try {
  if (isProduction) {
    logger = BrowserLogger.singleton({
      pid: armsPid,
      imgUrl: "https://arms-retcode-sg.aliyuncs.com/r.png?",
      appType: "web",
      sendResource: true,
      enableLinkTrace: true,
      behavior: true,
      disableHook: true,
      enableSPA: true,
      useFmp: true,
      ignore: {
        ignoreErrors: [
          /Script error/,
          /Request failed with status code/,
          /WEIXINSHARE/,
          /CustomError/,
          /Cannot set property 'fillStyle' of null/,
          /ResizeObserver loop limit exceeded/,
        ],
      },
    });
  }
} catch (e) {}

export const reportAPI = (url, success, time, status, message = "") => {
  logger && logger.api(url, success, time, status, message);
  if (!isProduction) {
    console.log("[REPORT_API]", [url, success, time, status, message]);
  }
};

export default logger;
