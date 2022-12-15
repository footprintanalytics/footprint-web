import React from "react";
import { Route } from "metabase/hoc/Title";
import { Redirect, IndexRoute } from "react-router";
import { t } from "ttag";
import LazyLoad from "../routesLazyLoad";
import { loadCurrentUser, loadCurrentUserVip } from "metabase/redux/user";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import getAccountRoutes from "metabase/account/routes";
import { loadConfig } from "metabase/redux/config";

const getRoutes = (store, IsDefiAuthenticated, IsDefi360) => {
  return (
    <Route title="Footprint Enterprise | Leading DeFi Protocol Analytics Platform Aiming to Build Crypto GA">
      <Redirect from="/defi" to="/defi360" />

      <Route
        path="defi360"
        onEnter={async (nextState, replace, done) => {
          store.dispatch(loadConfig());
          await store.dispatch(loadCurrentUser());
          store.getState().currentUser && store.dispatch(loadCurrentUserVip());
          done();
        }}
      >
        <IndexRoute component={LazyLoad.DeFiAbout} />

        <Route component={LazyLoad.DeFiAbout}>
          <ModalRoute
            title={t`Login`}
            path="loginModal"
            modal={LazyLoad.LoginModal}
            modalProps={{ className: "loginModalRoot" }}
          />
        </Route>

        <Route
          path="demo(/:protocolName(/:firstLevel(/:secondLevel/:thirdLevel)))"
          component={LazyLoad.DeFiDemo}
        />

        <Route component={IsDefiAuthenticated}>
          <Route component={IsDefi360}>
            <Route
              path="protocol-dashboard(/:protocolName(/:firstLevel(/:secondLevel/:thirdLevel)))"
              component={LazyLoad.DeFiDashboard}
            />

            <Route component={LazyLoad.DeFiLayout}>
              {/* chart */}
              <Route
                title={t`Question`}
                path="chart"
                component={LazyLoad.Question}
              >
                <Route
                  title={t`Custom Upload`}
                  path="custom-upload"
                  component={LazyLoad.CustomUpload}
                />
                <Route
                  title={t`Buffet`}
                  path=":slug/buffet"
                  component={LazyLoad.Question}
                />
                <Route
                  title={t`Notebook`}
                  path="notebook"
                  component={LazyLoad.Question}
                />
                <Route
                  title={t`Detail`}
                  path=":slug"
                  component={LazyLoad.Question}
                />
                <Route
                  title={t`Detail Notebook`}
                  path=":slug/notebook"
                  component={LazyLoad.Question}
                />
              </Route>

              {/* dashboard */}
              <Route
                title={t`Dashboard`}
                path="dashboard/:slug"
                component={LazyLoad.DashboardApp}
              >
                <ModalRoute
                  title={t`History`}
                  path="history"
                  modal={LazyLoad.DashboardHistoryModal}
                />
                <ModalRoute
                  title={t`Move`}
                  path="move"
                  modal={LazyLoad.DashboardMoveModal}
                />
                <ModalRoute
                  title={t`Copy`}
                  path="copy"
                  modal={LazyLoad.DashboardCopyModal}
                />
                <ModalRoute
                  title={t`Details`}
                  path="details"
                  modal={LazyLoad.DashboardDetailsModal}
                />
                <ModalRoute
                  title={t`Archive`}
                  path="archive"
                  modal={LazyLoad.ArchiveDashboardModal}
                />
              </Route>
            </Route>

            {/* account */}
            <Route component={LazyLoad.DeFiLayout}>
              {getAccountRoutes(store)}
            </Route>
          </Route>
        </Route>

        <Route component={LazyLoad.DeFiLayout}>
          {/* guest */}
          <Route title={t`Guest`} path="guest">
            <Route
              title={t`Dashboard`}
              path="dashboard/:uuid(/:name)"
              component={LazyLoad.GuestDashboard}
            >
              <ModalRoute
                title={t`Copy`}
                path="copy"
                modal={LazyLoad.DashboardCopyModal}
              />
            </Route>
            <Route
              title={t`Chart`}
              path="question/:uuid(/:name)"
              component={LazyLoad.GuestQuestion}
            />
            <Route
              title={t`Chart`}
              path="chart/:titleAndId"
              component={LazyLoad.GuestQuestion}
            />
          </Route>
        </Route>

        {/* auth */}
        <Route path="auth" component={LazyLoad.AuthApp}>
          <Route
            title={t`Logout`}
            path="logout"
            component={LazyLoad.LogoutApp}
          />
          <Route
            title={t`Forgot Password`}
            path="forgot_password"
            component={LazyLoad.ForgotPasswordApp}
          />
          <Route
            title={t`Reset Password`}
            path="reset_password/:token"
            component={LazyLoad.PasswordResetApp}
          />
        </Route>
      </Route>
    </Route>
  );
};

export default getRoutes;
