/* eslint-disable curly */
import axios from "axios";
import { message } from "antd";
import api from "metabase/lib/api";
import { reportAPI } from "metabase/lib/arms";

axios.defaults.baseURL = api.basename;
axios.defaults.headers.put["Content-Type"] = "application/json; charset=utf-8";

const getTime = () => {
  return Date.now();
};

axios.interceptors.request.use(config => {
  return { ...config, ...{ requestime: getTime() } };
});

axios.interceptors.response.use(
  response => {
    const time = getTime() - response.config.requestime;
    reportAPI(response.config.url, true, time, response.status, "OK");
    const { data, config } = response;
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
        message.error("You does not have permission to access");
        break;
      default:
        reportAPI(
          err.response.config.url,
          false,
          time,
          err.response.status || 601,
          err.message,
        );
        message.error("Service exception, please contact the administrator");
    }
  } else {
    const time = getTime() - err.config.requestime;
    reportAPI(err.config.url, false, time, err.code || 602, err.message);
  }
}

export const GET = async (url, params) => axios.get(url, { params });

export const POST = async (url, params, config) =>
  axios.post(url, params, config);

export const DELETE = async (url, params) => axios.delete(url, params);
