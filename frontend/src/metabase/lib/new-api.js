/* eslint-disable curly */
import axios from "axios";
import { message } from "antd";
import api from "metabase/lib/api";
import arms from "metabase/lib/arms";

axios.defaults.baseURL = api.basename;
axios.defaults.headers.put["Content-Type"] = "application/json; charset=utf-8";

const getTime = () => {
  return Date.now();
};

const reportARMS = (response, success, status, message = "") => {
  const userName = window.Metabase?.store?.getState()?.currentUser?.name;
  if (userName === "refreshCache") return;

  const { config: conf } = response;
  const time = getTime() - conf.requestime;
  arms && arms.api(conf.url, success, time, status, message);
};

axios.interceptors.request.use(config => {
  return { ...config, ...{ requestime: getTime() } };
});

axios.interceptors.response.use(
  response => {
    reportARMS(response, true, response.status);
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
    switch (err.response.status) {
      case 401:
        reportARMS(err.response, true, err.response.status);
        message.error("You does not have permission to access");
        break;
      default:
        reportARMS(err.response, false, err.response.status, err.message);
        message.error("Service exception, please contact the administrator");
    }
  } else {
    reportARMS({ config: err.config }, false, "ERROR", err.message);
  }
}

export const GET = async (url, params) => axios.get(url, { params });

export const POST = async (url, params, config) =>
  axios.post(url, params, config);

export const DELETE = async (url, params) => axios.delete(url, params);
