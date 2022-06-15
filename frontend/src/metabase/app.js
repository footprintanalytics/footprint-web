import "core-js/stable";
import "regenerator-runtime/runtime";

// Use of classList.add and .remove in Background and FitViewPort Hocs requires
// this polyfill so that those work in older browsers
import "classlist-polyfill";

import "number-to-locale-string";

// If enabled this monkeypatches `t` and `jt` to return blacked out
// strings/elements to assist in finding untranslated strings.
import "metabase/lib/i18n-debug";

// set the locale before loading anything else
import { loadLocalization } from "metabase/lib/i18n";

// NOTE: why do we need to load this here?
import "metabase/lib/colors";

// NOTE: this loads all builtin plugins
import "metabase/plugins/builtin";

// This is conditionally aliased in the webpack config.
// If EE isn't enabled, it loads an empty file.
import "ee-plugins"; // eslint-disable-line import/no-unresolved

import { PLUGIN_APP_INIT_FUCTIONS } from "metabase/plugins";

import registerVisualizations from "metabase/visualizations/register";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import { createTracker } from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";

import api from "metabase/lib/api";
import { initializeEmbedding } from "metabase/lib/embed";

import { getStore } from "./store";

import { refreshSiteSettings } from "metabase/redux/settings";

// router
import { Router, useRouterHistory } from "react-router";
import { createHistory } from "history";
import { syncHistoryWithStore } from "react-router-redux";

// drag and drop
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContextProvider } from "react-dnd";
// import { AliveScope } from "react-activation";

// antd
import { message, ConfigProvider } from "antd";
message.config({ top: 53 });
ConfigProvider.config({ theme: { primaryColor: "#3434B2" } });

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { hasuraUrl } from "./env";
import { QueryClient, QueryClientProvider } from "react-query";

const apolloClient = new ApolloClient({
  uri: hasuraUrl,
  cache: new InMemoryCache(),
});
const queryClient = new QueryClient();

// remove trailing slash
const BASENAME = window.MetabaseRoot.replace(/\/+$/, "");

api.basename = BASENAME;

// eslint-disable-next-line react-hooks/rules-of-hooks
const browserHistory = useRouterHistory(createHistory)({
  basename: BASENAME,
});

const theme = {
  space: [4, 8, 16, 32, 64, 128],
};

function _init(reducers, getRoutes, callback) {
  const store = getStore(reducers, browserHistory);
  const routes = getRoutes(store);
  const history = syncHistoryWithStore(browserHistory, store);
  createTracker(store);

  let root;
  ReactDOM.render(
    <Provider store={store} ref={ref => (root = ref)}>
      <DragDropContextProvider backend={HTML5Backend} context={{ window }}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              {/* <AliveScope> */}
              <Router history={history}>{routes}</Router>
              {/* </AliveScope> */}
            </ApolloProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </DragDropContextProvider>
    </Provider>,
    document.getElementById("root"),
  );

  registerVisualizations();

  initializeEmbedding(store);

  store.dispatch(refreshSiteSettings());

  MetabaseSettings.on("user-locale", async locale => {
    // reload locale definition and site settings with the new locale
    await Promise.all([
      loadLocalization(locale),
      store.dispatch(refreshSiteSettings({ locale })),
    ]);
    // force re-render of React application
    root.forceUpdate();
  });

  PLUGIN_APP_INIT_FUCTIONS.forEach(init => init({ root }));

  window.Metabase = window.Metabase || {};
  window.Metabase.store = store;
  window.Metabase.settings = MetabaseSettings;

  window.addEventListener("beforeunload", event => {
    // prompt user to save
    const isEditPaths = [
      "/chart",
      "/chart/notebook",
      "/dashboard/new",
    ].includes(location.pathname);
    const isEditing = store.getState().dashboard?.isEditing?.id;
    if (isEditPaths || isEditing) {
      event.returnValue = "";
    }
  });

  if (callback) {
    callback(store);
  }
}

export function init(...args) {
  function run() {
    _init(...args);
    setTimeout(() => document.getElementById("skeleton").remove(), 1000);
  }

  if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
}
