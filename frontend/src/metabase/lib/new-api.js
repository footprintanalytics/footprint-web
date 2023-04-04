/* eslint-disable curly */
import axios from "axios";
import { message } from "antd";
import { saveAs } from "file-saver";
import api from "metabase/lib/api";
import { reportAPI } from "metabase/lib/arms";
import { refreshCardData } from "metabase/dashboard/actions/cards";
import { getLatestGAProjectId } from "metabase/lib/project_info";

axios.defaults.baseURL = api.basename;
axios.defaults.headers.put["Content-Type"] = "application/json; charset=utf-8";

const getTime = () => {
  return Date.now();
};

const saveStream = (headers, data) => {
  const filename = headers["content-disposition"]
    ?.match(/".*"/)[0]
    ?.replace(/"/g, "");
  let blob;
  if (filename.endsWith("csv")) {
    blob = new Blob([data]);
  } else if (filename.endsWith("xlsx")) {
    blob = new Blob([data], { type: "application/octet-stream" });
  } else if (filename.endsWith("json")) {
    blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  }
  saveAs(blob, filename);
};

axios.interceptors.request.use(config => {
  const headers = config?.headers || {};
  const requestime = getTime();
  const latestGAProjectId = getLatestGAProjectId();
  const projectIdObject = latestGAProjectId
    ? { fgaProjectId: latestGAProjectId }
    : {};
  return {
    ...config,
    ...{ requestime: requestime },
    headers: {
      ...headers,
      common: {
        ...headers?.common,
        client_request_time: requestime,
        ...projectIdObject,
      },
    },
  };
});

axios.interceptors.response.use(
  async response => {
    const time = getTime() - response.config.requestime;
    reportAPI(response.config.url, true, time, response.status, "OK");
    const { data, config, headers } = response;
    if (data instanceof Blob) {
      const text = await data.text();
      if (text.includes('"code":-1')) {
        return Promise.reject(text);
      }
    }
    if (headers["content-type"] === "application/octet-stream") {
      saveStream(headers, data);
      return data;
    }
    if (data.code) {
      if (!config.silent) {
        message.error(data.message);
      }
      return Promise.reject(data.message);
    }
    return data.data;
  },
  error => {
    errorHandle(error);
    return Promise.reject(error);
  },
);

function errorHandle(err) {
  if (err.response) {
    const { config } = err.response;
    const time = getTime() - err.response.config.requestime;
    switch (err.response.status) {
      case 401:
        reportAPI(
          err.response.config.url,
          true,
          time,
          err.response.status,
          "OK",
        );
        message.error({
          content: "You does not have permission to access",
          key: "permission",
        });
        break;
      default:
        reportAPI(
          err.response.config.url,
          false,
          time,
          err.response.status || 601,
          err.message,
        );
        if (!config?.params?.silentFp) {
          message.error("Service exception, please contact the administrator");
        }
    }
  } else {
    const time = getTime() - err.config.requestime;
    reportAPI(err.config.url, false, time, err.code || 602, err.message);
    message.error("Service exception, please contact the administrator");
  }
}

export const GET = async (url, params) => axios.get(url, { params });

export const POST = async (url, params, config) =>
  axios.post(url, params, config);

export const PUT = async (url, params, config) =>
  axios.put(url, params, config);

export const DELETE = async (url, params) => axios.delete(url, params);
