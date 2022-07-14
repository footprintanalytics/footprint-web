import querystring from "querystring";

import EventEmitter from "events";
import isUrl from "metabase/lib/isUrl";
import { reportAPI } from "metabase/lib/arms";

import { delay } from "metabase/lib/promise";
import { IFRAMED } from "metabase/lib/dom";

type TransformFn = (o: any) => any;

export type Options = {
  noEvent?: boolean,
  json?: boolean,
  retry?: boolean,
  retryCount?: number,
  retryDelayIntervals?: number[],
  transformResponse?: TransformFn,
  cancelled?: Promise<any>,
  raw?: { [key: string]: boolean },
  headers?: { [key: string]: string },
  hasBody?: boolean,
  bodyParamName?: string,
};

const ONE_SECOND = 1000;
const MAX_RETRIES = 10;

const ANTI_CSRF_HEADER = "X-Metabase-Anti-CSRF-Token";

let ANTI_CSRF_TOKEN = null;

export type Data = {
  [key: string]: any,
};

const DEFAULT_OPTIONS: Options = {
  json: true,
  hasBody: false,
  noEvent: false,
  transformResponse: o => o,
  raw: {},
  headers: {},
  retry: false,
  retryCount: MAX_RETRIES,
  // Creates an array with exponential backoff in millis
  // i.e. [1000, 2000, 4000, 8000...]
  retryDelayIntervals: Array.from(new Array(MAX_RETRIES).keys())
    .map(x => ONE_SECOND * Math.pow(2, x))
    .reverse(),
};

export type APIMethod = (d?: Data, o?: Options) => Promise<any>;
export type APICreator = (t: string, o?: Options | TransformFn) => APIMethod;

export class Api extends EventEmitter {
  basename = "";

  GET: APICreator;
  POST: APICreator;
  PUT: APICreator;
  DELETE: APICreator;

  constructor() {
    super();
    this.GET = this._makeMethod("GET", { retry: true });
    this.DELETE = this._makeMethod("DELETE", {});
    this.POST = this._makeMethod("POST", { hasBody: true, retry: true });
    this.PUT = this._makeMethod("PUT", { hasBody: true });
  }

  _makeMethod(method: string, creatorOptions?: Options = {}): APICreator {
    return (
      urlTemplate: string,
      methodOptions?: Options | TransformFn = {},
    ) => {
      if (typeof methodOptions === "function") {
        methodOptions = { transformResponse: methodOptions };
      }

      const defaultOptions = {
        ...DEFAULT_OPTIONS,
        ...creatorOptions,
        ...methodOptions,
      };

      return async (
        data?: Data,
        invocationOptions?: Options = {},
      ): Promise<any> => {
        const options: Options = { ...defaultOptions, ...invocationOptions };
        let url = urlTemplate;
        data = { ...data };
        for (const tag of url.match(/:\w+/g) || []) {
          const paramName = tag.slice(1);
          let value = data[paramName];
          delete data[paramName];
          if (value === undefined) {
            console.warn("Warning: calling", method, "without", tag);
            value = "";
          }
          if (!options.raw || !options.raw[paramName]) {
            value = encodeURIComponent(value);
          }
          url = url.replace(tag, value);
        }
        // remove undefined
        for (const name in data) {
          if (data[name] === undefined) {
            delete data[name];
          }
        }

        const headers: { [key: string]: string } = options.json
          ? { Accept: "application/json", "Content-Type": "application/json" }
          : {};

        if (IFRAMED) {
          headers["X-Metabase-Embedded"] = "true";
        }

        if (ANTI_CSRF_TOKEN) {
          headers[ANTI_CSRF_HEADER] = ANTI_CSRF_TOKEN;
        }

        let body;
        if (options.hasBody) {
          body = JSON.stringify(
            options.bodyParamName != null ? data[options.bodyParamName] : data,
          );
        } else {
          const qs = querystring.stringify(data);
          if (qs) {
            url += (url.indexOf("?") >= 0 ? "&" : "?") + qs;
          }
        }

        Object.assign(headers, options.headers);

        if (options.retry) {
          return this._makeRequestWithRetries(
            method,
            url,
            headers,
            body,
            data,
            options,
          );
        } else {
          return this._makeRequest(method, url, headers, body, data, options);
        }
      };
    };
  }

  async _makeRequestWithRetries(method, url, headers, body, data, options) {
    // Get a copy of the delay intervals that we can remove items from as we retry
    const retryDelays = options.retryDelayIntervals.slice();
    let retryCount: number = 0;
    // maxAttempts is the first attempt followed by the number of retries
    const maxAttempts: number = options.retryCount + 1;
    // Make the first attempt for the request, then loop incrementing the retryCount
    do {
      try {
        return await this._makeRequest(
          method,
          url,
          headers,
          body,
          data,
          options,
        );
      } catch (e) {
        retryCount++;
        // If the response is 503 and the next retry won't put us over the maxAttempts,
        // wait a bit and try again
        if (e.status === 503 && retryCount < maxAttempts) {
          await delay(retryDelays.pop());
        } else {
          throw e;
        }
      }
    } while (retryCount < maxAttempts);
  }

  // TODO Atte Keinänen 6/26/17: Replacing this with isomorphic-fetch could simplify the implementation
  _makeRequest(method, url, headers, body, data, options) {
    return new Promise((resolve, reject) => {
      let isCancelled = false;
      const begin = Date.now();
      const xhr = new XMLHttpRequest();
      let requestUrl = url;
      if (!isUrl(url)) {
        requestUrl = this.basename + url;
      }
      xhr.open(method, requestUrl);
      for (const headerName in headers) {
        xhr.setRequestHeader(headerName, headers[headerName]);
      }
      let armsObject = null;

      xhr.onloadend = () => {
        if (armsObject) {
          reportAPI(
            armsObject.requestUrl,
            armsObject.success,
            armsObject.time,
            armsObject.status,
            armsObject.statusText,
          );
        }
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (!isCancelled) {
            const time = Date.now() - begin;
            const status = xhr.status;
            const success =
              (status >= 200 && status < 300) ||
              status === 304 ||
              status === 401;
            armsObject = {
              requestUrl,
              success: success,
              status: status,
              time: time,
              statusText: xhr.statusText,
            };
          }
          // getResponseHeader() is case-insensitive
          const antiCsrfToken = xhr.getResponseHeader(ANTI_CSRF_HEADER);
          if (antiCsrfToken) {
            ANTI_CSRF_TOKEN = antiCsrfToken;
          }

          let body = xhr.responseText;
          if (options.json) {
            try {
              body = JSON.parse(body);
            } catch (e) {}
          }
          let status = xhr.status;
          if (status === 202 && body && body._status > 0) {
            status = body._status;
          }
          if (status >= 200 && status <= 299) {
            if (options.transformResponse) {
              body = options.transformResponse(body, { data });
              if (body.code > 1) {
                reject({
                  status: body.code,
                  data: body,
                  isCancelled: isCancelled,
                });
                return;
              }
            }
            resolve(body);
          } else {
            reject({
              status: status,
              data: body,
              isCancelled: isCancelled,
            });
          }
          if (!options.noEvent) {
            this.emit(status, url);
          }
        }
      };
      xhr.onerror = e => {
        const time = Date.now() - begin;
        armsObject = {
          requestUrl,
          success: false,
          status: xhr.status || 603,
          time,
          statusText: e.message,
        };
      };
      xhr.send(body);

      if (options.cancelled) {
        options.cancelled.then(() => {
          isCancelled = true;
          xhr.abort();
        });
      }
    });
  }
}

const instance = new Api();

export default instance;
export const { GET, POST, PUT, DELETE } = instance;
