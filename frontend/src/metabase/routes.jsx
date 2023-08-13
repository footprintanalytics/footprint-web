import React from "react";

import { IndexRedirect, IndexRoute, Redirect } from "react-router";
import { routerActions } from "react-router-redux";
import { UserAuthWrapper } from "redux-auth-wrapper";
import { t } from "ttag";
import { Route } from "metabase/hoc/Title";
import {
  loadCurrentUser,
  loadCurrentUserVip,
  loadCurrentUserVipDataApi,
} from "metabase/redux/user";
import MetabaseSettings from "metabase/lib/settings";
import { Unauthorized } from "metabase/containers/ErrorPages";
import getAccountRoutes from "metabase/account/routes";
import getAdminRoutes from "metabase/admin/routes";
import getCollectionTimelineRoutes from "metabase/timelines/collections/routes";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import { trackPageView } from "metabase/lib/analytics";
import { getAdminPaths } from "metabase/admin/app/selectors";
import { loadConfig } from "metabase/redux/config";
import { isProduction } from "metabase/env";
import LazyLoad from "./routesLazyLoad";

const MetabaseIsSetup = UserAuthWrapper({
  predicate: authData => (isProduction ? !authData.hasSetupToken : true),
  failureRedirectPath: "/setup",
  authSelector: state => ({ hasUserSetup: MetabaseSettings.hasUserSetup() }), // HACK
  wrapperDisplayName: "MetabaseIsSetup",
  allowRedirectBack: false,
  redirectAction: routerActions.replace,
});

const UserIsAuthenticated = UserAuthWrapper({
  failureRedirectPath: () => {
    const from = localStorage.getItem("lastGTag");
    return `/loginModal?${from ? "from=" + from : ""}`;
  },
  authSelector: state => state.currentUser,
  wrapperDisplayName: "UserIsAuthenticated",
  redirectAction: routerActions.replace,
});

const UserIsAdmin = UserAuthWrapper({
  predicate: currentUser => currentUser && currentUser.is_superuser,
  failureRedirectPath: "/unauthorized",
  authSelector: state => state.currentUser,
  allowRedirectBack: false,
  wrapperDisplayName: "UserIsAdmin",
  redirectAction: routerActions.replace,
});

const UserIsNotAuthenticated = UserAuthWrapper({
  predicate: currentUser => !currentUser,
  failureRedirectPath: "/",
  authSelector: state => state.currentUser,
  allowRedirectBack: false,
  wrapperDisplayName: "UserIsNotAuthenticated",
  redirectAction: routerActions.replace,
});

const UserCanAccessSettings = UserAuthWrapper({
  predicate: adminItems => adminItems?.length > 0,
  failureRedirectPath: "/unauthorized",
  authSelector: getAdminPaths,
  allowRedirectBack: false,
  wrapperDisplayName: "UserCanAccessSettings",
  redirectAction: routerActions.replace,
});

const IsAuthenticated = MetabaseIsSetup(
  UserIsAuthenticated(({ children }) => children),
);
const IsAdmin = MetabaseIsSetup(
  UserIsAuthenticated(UserIsAdmin(({ children }) => children)),
);

const IsNotAuthenticated = MetabaseIsSetup(
  UserIsNotAuthenticated(({ children }) => children),
);

const CanAccessSettings = MetabaseIsSetup(
  UserIsAuthenticated(UserCanAccessSettings(({ children }) => children)),
);

export const getRoutes = store => (
  <Route
    title={t`Footprint Analytics`}
    component={LazyLoad.App}
    onEnter={nextState => {
      trackPageView(nextState.location.pathname, "Enter");
    }}
  >
    {/* SETUP */}
    <Route
      path="/setup"
      component={LazyLoad.SetupApp}
      onEnter={(nextState, replace) => {
        if (MetabaseSettings.hasUserSetup()) {
          replace("/");
        }
      }}
    />

    {/* PUBLICLY SHARED LINKS */}
    <Route path="public">
      <Route
        title={t`Public Question`}
        path="question/:uuid"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Public Dashboard`}
        path="dashboard/:uuid"
        component={LazyLoad.PublicDashboard}
      />
    </Route>

    {/* APP */}
    <Route
      onEnter={async (nextState, replace, done) => {
        store.dispatch(loadConfig());
        await store.dispatch(loadCurrentUser());
        if (store.getState().currentUser) {
          store.dispatch(loadCurrentUserVip());
          store.dispatch(loadCurrentUserVipDataApi());
        }
        done();
      }}
      onChange={(prevState, nextState, replace) => {
        let { pathname: prevPathname } = prevState.location;
        if (!prevPathname.startsWith("/")) {
          prevPathname = "/" + prevPathname;
        }
        let { pathname: nextPathname } = nextState.location;
        if (!nextPathname.startsWith("/")) {
          nextPathname = "/" + nextPathname;
        }
        if (
          prevPathname.startsWith("/growth") &&
          !nextPathname.startsWith("/growth")
        ) {
          nextState.location.pathname = `/growth${nextPathname}`
          replace(nextState.location)
        }
        if (
          prevPathname.startsWith("/fga") &&
          !nextPathname.startsWith("/fga")
        ) {
          nextState.location.pathname = `/fga${nextPathname}`
          replace(nextState.location)
        }
      }}
    >
      <Route path="/" component={LazyLoad.About}>
        {/*<IndexRedirect to="/about" />*/}
        <ModalRoute
          title={t`Login`}
          path="loginModal"
          modal={LazyLoad.LoginModal}
          modalProps={{ className: "loginModalRoot" }}
        />
      </Route>

      <Route path="/topic" component={LazyLoad.Features}>
        <Route path=":menu/:subMenu" />
      </Route>

      <Route path="/research">
        <IndexRoute
          component={props => <LazyLoad.Research {...props} classify="nft" />}
        />
        <Route
          path="nft"
          component={props => <LazyLoad.Research {...props} classify="nft" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="gamefi"
          component={props => (
            <LazyLoad.Research {...props} classify="gamefi" />
          )}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="chain"
          component={props => <LazyLoad.Research {...props} classify="chain" />}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
        <Route
          path="wallet"
          component={props => (
            <LazyLoad.Research {...props} classify="wallet" />
          )}
        >
          <Route path=":menu/:subMenu" />
          <Route path=":menu/:subMenu/:value" />
        </Route>
      </Route>

      <Route path="/dashboards" component={LazyLoad.Dashboards} />

      <Route path="/data-api">
        <IndexRoute component={LazyLoad.dataApi} />
        <Route path="/data-api/pricing" component={LazyLoad.dataApiPrice} />
        <Route path="/data-api/product" component={LazyLoad.dataApiProduct} />
        <Route
          path="/data-api/statistics"
          component={LazyLoad.dataApiStatistics}
        />
      </Route>

      <Route path="/batch-download">
        <IndexRoute component={LazyLoad.batchDownload} />
      </Route>

      <Route
        title={t`Protocols`}
        path="/protocols"
        component={LazyLoad.Protocols}
      />

      <Route title={t`Creator`} path="/@:name" component={LazyLoad.Creator} />

      <Route title={t`Search`} path="/search" component={LazyLoad.Search} />

      <Route
        title={t`Footprint Widget`}
        path="/widget"
        component={LazyLoad.Widget}
      />

      <Route
        title={t`Dashboard`}
        path="/@:name/:dashboardName"
        component={LazyLoad.DashboardApp}
      >
        {/*<ModalRoute
          title={t`History`}
          path="history"
          modal={LazyLoad.DashboardHistoryModal}
        />*/}
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

      <Route
        title={t`Protocols - Footprint Analytics`}
        path="/@:name"
        component={LazyLoad.Creator}
      />

      <Route title={t`Search`} path="/search" component={LazyLoad.Search} />

      <Route
        title={t`Project Analytics`}
        path="/projects"
        component={LazyLoad.ProjectAnalytics}
      />
      <Route
        title={t`Chain Analytics`}
        path="/chains"
        component={LazyLoad.ProjectAnalytics}
      />
      <Route
        path="/project/Detail/:slug(/:name)"
        component={LazyLoad.ProjectDetail}
      />
      <Route
        path="/chain/Detail/:slug(/:name)"
        component={LazyLoad.ProjectDetail}
      />
      <Route path="/protocols/:slug" component={LazyLoad.ProtocolDetail} />

      <Route title={t`Pricing`} path="/pricing" component={LazyLoad.Pricing} />
      <Route path="/about" component={LazyLoad.About} />
      <Route path="/moon-men" component={LazyLoad.NftPage} />
      {/*<Route title={t`Kcc`} path="/kcc" component={LazyLoad.Zkspace} />*/}
      <Route title={t`News`} path="/news" component={LazyLoad.News}>
        <IndexRoute
          component={props => <LazyLoad.Articles {...props} type="all" />}
        />
        <Route
          title={t`All`}
          path="all"
          component={props => <LazyLoad.Articles {...props} type="all" />}
        />
        <Route
          title={t`Articles`}
          path="articles"
          component={props => <LazyLoad.Reports {...props} type="articles" />}
        />
        <Route
          title={t`Reports`}
          path="reports"
          component={props => <LazyLoad.Reports {...props} type="research" />}
        />
        <Route
          title={t`Flash`}
          hidden
          path="featured"
          component={LazyLoad.Featured}
        />
        <Route
          title={t`Company`}
          path="company"
          component={props => <LazyLoad.Articles {...props} type="company" />}
        />
        <Route
          title={t`Product`}
          path="product"
          component={props => <LazyLoad.Reports {...props} type="product" />}
        />
        <Route
          title={t`Academy`}
          path="academy"
          isHot
          component={props => <LazyLoad.Reports {...props} type="academy" />}
        />
        <Route
          title={t`Events`}
          path="events"
          component={props => <LazyLoad.Reports {...props} type="events" />}
        />
        <Route
          title={t`Newsletter`}
          path="weekly-letter"
          component={props => (
            <LazyLoad.Articles {...props} type="week-letter" />
          )}
        />
        <Route
          title={t`Community insights`}
          path="community-insights"
          component={props => (
            <LazyLoad.Articles {...props} type="community-insights" />
          )}
        />
        <Route
          title={t`Feature Charts`}
          path="feature_charts"
          hidden
          component={props => (
            <LazyLoad.FeatureCharts {...props} type="feature_charts" />
          )}
        />
        <Route
          title={t`Daily News`}
          path="daily-news"
          hidden
          component={props => <LazyLoad.Articles {...props} type="dailyNews" />}
        />
        <Route
          title={t`Write for Us`}
          path="write-for-us"
          hidden
          component={props => (
            <LazyLoad.WriteForUs {...props} type="writeForUs" />
          )}
        />
      </Route>

      <Route
        title={t`Activate`}
        path="/activate"
        component={LazyLoad.ActivateAccount}
      />
      <Route
        title={t`Article Detail`}
        path="/news/articles/:id"
        component={LazyLoad.ArticleDetail}
      >
        <Route path=":title" />
      </Route>
      <Route
        title={t`Article Detail`}
        path="/article/:titleAndId"
        component={LazyLoad.ArticleDetail}
      />
      <Route
        title={t`Daily News`}
        path="/daily-news/:titleAndId"
        component={LazyLoad.ArticleDetail}
      />
      <Route
        title={t`Flash Detail`}
        path="/flash/:titleAndId"
        component={LazyLoad.ArticleDetail}
      />

      <Route
        title={t`Article Publish`}
        path="/news/publish"
        component={LazyLoad.Publish}
      >
        <Route title={t`Article Edit`} path="/news/publish/:slug" />
      </Route>
      <Route
        title={t`Tutorials`}
        path="/tutorials"
        component={LazyLoad.Tutorials}
      >
        <IndexRoute component={LazyLoad.TutorialsVisualizations} />
        <Route
          title={t`Featured Charts`}
          path="visualizations"
          component={LazyLoad.TutorialsVisualizations}
        />
        <Route
          title={t`Tutorial Videos`}
          path="videos"
          component={LazyLoad.TutorialsVideos}
        />
        <Route
          title={t`Indicators`}
          path="indicators"
          component={LazyLoad.TutorialsIndicators}
        />
      </Route>
      <Route title={t`Academy`} path="/academy" component={LazyLoad.Academy} />
      {/*<Route title={t`Explore`} path="/explore" component={LazyLoad.Explore}>
        <Route title={t`Dashboard`} path="dashboard/:slug">
          <ModalRoute
            title={t`Copy`}
            path="copy"
            modal={LazyLoad.DashboardCopyModal}
          />
        </Route>
      </Route>*/}
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
      {/* ----------- Growth Analytics 👇 --------- */}
      <Route
        path="/growth/dashboard/:slug"
        title={t`Dashboard`}
        component={LazyLoad.DashboardApp}
      >
        <ModalRoute path="move" modal={LazyLoad.DashboardMoveModal} />
        <ModalRoute path="copy" modal={LazyLoad.DashboardCopyModal} />
        <ModalRoute path="archive" modal={LazyLoad.ArchiveDashboardModal} />
        <ModalRoute path="details" modal={LazyLoad.DashboardDetailsModal} />
      </Route>
      <Route
        title={t`Creator`}
        path="/growth/@:name"
        component={LazyLoad.Creator}
      />
      <Route
        title={t`Dashboard`}
        path="/growth/@:name/:dashboardName"
        component={LazyLoad.WrapDashboard}
      />
      <Route
        title={t`Dashboard`}
        path="/growth/dashboard/@:name/:dashboardName"
        component={LazyLoad.DashboardApp}
      >
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
      <Route
        title={t`Public Dashboard`}
        path="/growth/public/dashboard/:uuid"
        component={LazyLoad.PublicDashboard}
      />
      <Route
        title={t`Create Campaign`}
        path="/growth/campaign(/:type)"
        component={LazyLoad.CreateCampaign}
      />
      <Route
        title={t`Chart`}
        path="/growth/guest/chart/:titleAndId"
        component={LazyLoad.GuestQuestion}
      />
      <Route
        title={t`Chart`}
        path="/growth/public/scene/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Chart`}
        path="/growth/public/widget/chart/:uuid"
        component={LazyLoad.WidgetPublic}
      />
      <Route
        title={t`Chart`}
        path="/growth/public/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Question`}
        path="/growth/chart"
        component={LazyLoad.Question}
      >
        {/* <IndexRoute component={Question} /> */}
        {/* NEW QUESTION FLOW */}
        {/* <Route path="new" title={t`New query`} component={NewQueryOptions} /> */}
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
        <Route title={t`Detail`} path=":slug" component={LazyLoad.Question} />
        <Route
          title={t`Detail Notebook`}
          path=":slug/notebook"
          component={LazyLoad.Question}
        />
      </Route>
      <Route
        title={t`Growth`}
        path="/growth"
        component={LazyLoad.GaProjectContainer}
      >
        <Route path="project/:project(/:menu)" />
      </Route>
      <Route
        title={t`Pricing`}
        path="/growth/pricing"
        component={LazyLoad.FgaPrice}
      />
      <Route
        title={t`Submit Contract`}
        path="/growth/submit/contract/add"
        component={LazyLoad.SubmitContractAddV2}
      />
      <Route
        title={t`Submit Contract`}
        path="/growth/submit/contract"
        component={LazyLoad.SubmitContract}
      />
      <Route
        title={t`Submit Contract`}
        path="/growth/submit/contract/success"
        component={LazyLoad.SubmitContractSuccess}
      />

      {/* ----------- Growth Analytics 👆 --------- */}
      {/* reference data 👇 */}
      <Route path="/reference">
        <Route
          title={t`Submit Contract`}
          path="submit/contract"
          component={LazyLoad.SubmitRefContract}
        />
        <Route
          title={t`Submit Contract`}
          path="submit/contract/add"
          component={LazyLoad.SubmitRefContractAdd}
        />
      </Route>
      {/* reference data 👆 */}

      {/* ----------- AB Analytics 👇 --------- */}
      <Route
        path="/fga/dashboard/:slug"
        title={t`Dashboard`}
        component={LazyLoad.DashboardApp}
      >
        <ModalRoute path="move" modal={LazyLoad.DashboardMoveModal} />
        <ModalRoute path="copy" modal={LazyLoad.DashboardCopyModal} />
        <ModalRoute path="archive" modal={LazyLoad.ArchiveDashboardModal} />
        <ModalRoute path="details" modal={LazyLoad.DashboardDetailsModal} />
      </Route>
      <Route
        title={t`Creator`}
        path="/fga/@:name"
        component={LazyLoad.Creator}
      />
      <Route
        title={t`Dashboard`}
        path="/fga/@:name/:dashboardName"
        component={LazyLoad.WrapDashboard}
      />
      <Route
        title={t`Dashboard`}
        path="/fga/dashboard/@:name/:dashboardName"
        component={LazyLoad.DashboardApp}
      >
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
      <Route
        title={t`Public Dashboard`}
        path="/fga/public/dashboard/:uuid"
        component={LazyLoad.PublicDashboard}
      />
      <Route
        title={t`Create Campaign`}
        path="/fga/campaign(/:type)"
        component={LazyLoad.CreateCampaign}
      />
      <Route
        title={t`Chart`}
        path="/fga/guest/chart/:titleAndId"
        component={LazyLoad.GuestQuestion}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/scene/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/widget/chart/:uuid"
        component={LazyLoad.WidgetPublic}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Question`}
        path="/fga/chart"
        component={LazyLoad.Question}
      >
        {/* <IndexRoute component={Question} /> */}
        {/* NEW QUESTION FLOW */}
        {/* <Route path="new" title={t`New query`} component={NewQueryOptions} /> */}
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
        <Route title={t`Detail`} path=":slug" component={LazyLoad.Question} />
        <Route
          title={t`Detail Notebook`}
          path=":slug/notebook"
          component={LazyLoad.Question}
        />
      </Route>
      <Route
        title={t`Growth`}
        path="/fga"
        component={LazyLoad.ABProjectContainer}
      >
        <Route path="project/:project(/:menu)" />
      </Route>
      <Route
        title={t`Pricing`}
        path="/fga/pricing"
        component={LazyLoad.FgaPrice}
      />
      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract/add"
        component={LazyLoad.SubmitContractAddV2}
      />

      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract"
        component={LazyLoad.SubmitContract}
      />
      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract/success"
        component={LazyLoad.SubmitContractSuccess}
      />

      {/* ----------- AB Analytics 👆 --------- */}

      {/* ----------- AB Analytics 👇 --------- */}
      <Route
        path="/fga/dashboard/:slug"
        title={t`Dashboard`}
        component={LazyLoad.DashboardApp}
      >
        <ModalRoute path="move" modal={LazyLoad.DashboardMoveModal} />
        <ModalRoute path="copy" modal={LazyLoad.DashboardCopyModal} />
        <ModalRoute path="archive" modal={LazyLoad.ArchiveDashboardModal} />
        <ModalRoute path="details" modal={LazyLoad.DashboardDetailsModal} />
      </Route>
      <Route
        title={t`Creator`}
        path="/fga/@:name"
        component={LazyLoad.Creator}
      />
      <Route
        title={t`Dashboard`}
        path="/fga/@:name/:dashboardName"
        component={LazyLoad.WrapDashboard}
      />
      <Route
        title={t`Dashboard`}
        path="/fga/dashboard/@:name/:dashboardName"
        component={LazyLoad.DashboardApp}
      >
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
      <Route
        title={t`Public Dashboard`}
        path="/fga/public/dashboard/:uuid"
        component={LazyLoad.PublicDashboard}
      />
      <Route
        title={t`Create Campaign`}
        path="/fga/campaign(/:type)"
        component={LazyLoad.CreateCampaign}
      />
      <Route
        title={t`Chart`}
        path="/fga/guest/chart/:titleAndId"
        component={LazyLoad.GuestQuestion}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/scene/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/widget/chart/:uuid"
        component={LazyLoad.WidgetPublic}
      />
      <Route
        title={t`Chart`}
        path="/fga/public/chart/:titleAndId"
        component={LazyLoad.PublicQuestion}
      />
      <Route
        title={t`Question`}
        path="/fga/chart"
        component={LazyLoad.Question}
      >
        {/* <IndexRoute component={Question} /> */}
        {/* NEW QUESTION FLOW */}
        {/* <Route path="new" title={t`New query`} component={NewQueryOptions} /> */}
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
        <Route title={t`Detail`} path=":slug" component={LazyLoad.Question} />
        <Route
          title={t`Detail Notebook`}
          path=":slug/notebook"
          component={LazyLoad.Question}
        />
      </Route>
      <Route
        title={t`Growth`}
        path="/fga"
        component={LazyLoad.ABProjectContainer}
      >
        <Route path="project/:project(/:menu)" />
      </Route>
      <Route
        title={t`Pricing`}
        path="/fga/pricing"
        component={LazyLoad.FgaPrice}
      />
      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract/add"
        component={LazyLoad.SubmitContractAddV2}
      />

      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract"
        component={LazyLoad.SubmitContract}
      />
      <Route
        title={t`Submit Contract`}
        path="/fga/submit/contract/success"
        component={LazyLoad.SubmitContractSuccess}
      />

      {/* ----------- AB Analytics 👆 --------- */}

      <Route title={t`Question`} path="/chart" component={LazyLoad.Question}>
        {/* <IndexRoute component={Question} /> */}
        {/* NEW QUESTION FLOW */}
        {/* <Route path="new" title={t`New query`} component={NewQueryOptions} /> */}
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
        <Route title={t`Detail`} path=":slug" component={LazyLoad.Question} />
        <Route
          title={t`Detail Notebook`}
          path=":slug/notebook"
          component={LazyLoad.Question}
        />
      </Route>

      {/* AUTH */}
      <Route path="/auth">
        <IndexRedirect to="/auth/login" />
        <Route component={IsNotAuthenticated}>
          <Route path="login" title={t`Login`} component={LazyLoad.LoginApp} />
          <Route
            path="login/:provider"
            title={t`Login`}
            component={LazyLoad.LoginApp}
          />
        </Route>
        <Route path="logout" component={LazyLoad.LogoutApp} />
        <Route path="forgot_password" component={LazyLoad.ForgotPasswordApp} />
        <Route
          path="reset_password/:token"
          component={LazyLoad.ResetPasswordApp}
        />
      </Route>

      {/* MAIN */}
      <Route component={IsAuthenticated}>
        {/* The global all hands routes, things in here are for all the folks */}
        {/*<Route
          path="/"
          component={HomePage}
          onEnter={(nextState, replace) => {
            const page = PLUGIN_LANDING_PAGE[0] && PLUGIN_LANDING_PAGE[0]();
            if (page && page !== "/") {
              replace(page);
            }
          }}
        />*/}

        <Route path="/studio" component={LazyLoad.MyStudio}>
          <Route path=":menu/:subMenu" />
          <Route path=":menu" />
        </Route>

        <Route title={t`Market`} path="market">
          <Route
            title={t`Upgrade`}
            path="upgrade"
            component={LazyLoad.Upgrade}
          />
          <Route
            title={t`Picture`}
            path="picture"
            component={LazyLoad.Market}
          />
        </Route>

        <Route path="search" title={t`Search`} component={LazyLoad.SearchApp} />
        <Route
          path="archive"
          title={t`Archive`}
          component={LazyLoad.ArchiveApp}
        />

        <Route path="collection/users" component={IsAdmin}>
          <IndexRoute component={LazyLoad.UserCollectionList} />
        </Route>

        <Route path="collection/:slug" component={LazyLoad.CollectionLanding}>
          <ModalRoute path="move" modal={LazyLoad.MoveCollectionModal} />
          <ModalRoute path="archive" modal={LazyLoad.ArchiveCollectionModal} />
          <ModalRoute path="new_collection" modal={LazyLoad.CollectionCreate} />
          <ModalRoute
            path="new_dashboard"
            modal={LazyLoad.CreateDashboardModal}
          />
          <ModalRoute
            path="permissions"
            modal={LazyLoad.CollectionPermissionsModal}
          />
          {getCollectionTimelineRoutes()}
        </Route>

        <Route path="activity" component={LazyLoad.ActivityApp} />

        <Route
          path="dashboard/:slug"
          title={t`Dashboard`}
          component={LazyLoad.DashboardApp}
        >
          <ModalRoute path="move" modal={LazyLoad.DashboardMoveModal} />
          <ModalRoute path="copy" modal={LazyLoad.DashboardCopyModal} />
          <ModalRoute path="archive" modal={LazyLoad.ArchiveDashboardModal} />
          <ModalRoute path="details" modal={LazyLoad.DashboardDetailsModal} />
        </Route>

        <Route path="/question">
          <IndexRoute component={LazyLoad.QueryBuilder} />
          <Route path="notebook" component={LazyLoad.QueryBuilder} />
          <Route path=":slug" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/notebook" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/:objectId" component={LazyLoad.QueryBuilder} />
        </Route>

        <Route path="/model">
          <IndexRoute component={LazyLoad.QueryBuilder} />
          <Route
            path="new"
            title={t`New Model`}
            component={LazyLoad.NewModelOptions}
          />
          <Route path="notebook" component={LazyLoad.QueryBuilder} />
          <Route path=":slug" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/notebook" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/query" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/metadata" component={LazyLoad.QueryBuilder} />
          <Route path=":slug/:objectId" component={LazyLoad.QueryBuilder} />
          <Route path="query" component={LazyLoad.QueryBuilder} />
          <Route path="metadata" component={LazyLoad.QueryBuilder} />
        </Route>

        <Route path="browse" component={LazyLoad.BrowseApp}>
          <IndexRoute component={LazyLoad.DatabaseBrowser} />
          <Route path=":slug" component={LazyLoad.SchemaBrowser} />
          <Route
            path=":dbId/schema/:schemaName"
            component={LazyLoad.TableBrowser}
          />
        </Route>

        {/* INDIVIDUAL DASHBOARDS */}

        {/*<Route path="/auto/dashboard/*" component={AutomaticDashboardApp} />*/}

        <Route
          title={t`Submit Contract`}
          path="/submit/contract"
          component={LazyLoad.SubmitContract}
        />
        <Route
          title={t`Submit Contract`}
          path="/submit/contract/add-v1"
          component={LazyLoad.SubmitContractAdd}
        />
        <Route
          title={t`Submit Contract`}
          path="/submit/contract/add"
          component={LazyLoad.SubmitContractAddV2}
        />
        <Route
          title={t`Submit Contract`}
          path="/submit/contract/success"
          component={LazyLoad.SubmitContractSuccess}
        />
        <Route path="/collections">
          <Route path="create" component={LazyLoad.CollectionCreate} />
        </Route>

        {/* REFERENCE */}
        {/*<Route path="/reference" title={t`Data Reference`}>
          <IndexRedirect to="/reference/databases" />
          <Route path="metrics" component={LazyLoad.MetricListContainer} />
          <Route path="metrics/:metricId" component={LazyLoad.MetricDetailContainer} />
          <Route
            path="metrics/:metricId/edit"
            component={LazyLoad.MetricDetailContainer}
          />
          <Route
            path="metrics/:metricId/questions"
            component={LazyLoad.MetricQuestionsContainer}
          />
          <Route
            path="metrics/:metricId/revisions"
            component={LazyLoad.MetricRevisionsContainer}
          />
          <Route path="segments" component={LazyLoad.SegmentListContainer} />
          <Route
            path="segments/:segmentId"
            component={LazyLoad.SegmentDetailContainer}
          />
          <Route
            path="segments/:segmentId/fields"
            component={LazyLoad.SegmentFieldListContainer}
          />
          <Route
            path="segments/:segmentId/fields/:fieldId"
            component={LazyLoad.SegmentFieldDetailContainer}
          />
          <Route
            path="segments/:segmentId/questions"
            component={LazyLoad.SegmentQuestionsContainer}
          />
          <Route
            path="segments/:segmentId/revisions"
            component={LazyLoad.SegmentRevisionsContainer}
          />
          <Route path="databases" component={LazyLoad.DatabaseListContainer} />
          <Route
            path="databases/:databaseId"
            component={LazyLoad.DatabaseDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables"
            component={LazyLoad.TableListContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId"
            component={LazyLoad.TableDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/fields"
            component={LazyLoad.FieldListContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/fields/:fieldId"
            component={LazyLoad.FieldDetailContainer}
          />
          <Route
            path="databases/:databaseId/tables/:tableId/questions"
            component={LazyLoad.TableQuestionsContainer}
          />
        </Route>*/}

        {/* PULSE */}
        <Route path="/pulse" title={t`Pulses`}>
          {/* NOTE: legacy route, not linked to in app */}
          <IndexRedirect to="/search" query={{ type: "pulse" }} />
          <Route path="create" component={LazyLoad.PulseEditApp} />
          <Route path=":pulseId">
            <IndexRoute component={LazyLoad.PulseEditApp} />
          </Route>
        </Route>

        {/* ACCOUNT */}
        {getAccountRoutes(store, IsAuthenticated)}

        {/* ADMIN */}
        {getAdminRoutes(store, CanAccessSettings, IsAdmin)}
      </Route>
    </Route>

    {/* INTERNAL */}
    <Route
      path="/_internal"
      getChildRoutes={(partialNextState, callback) =>
        require.ensure([], function (require) {
          callback(null, [require("metabase/internal/routes").default]);
        })
      }
    />

    {/* DEPRECATED */}
    {/* NOTE: these custom routes are needed because <Redirect> doesn't preserve the hash */}
    <Route
      path="/q"
      onEnter={({ location }, replace) =>
        replace({ pathname: "/question", hash: location.hash })
      }
    />
    <Route
      path="/card/:slug"
      onEnter={({ location, params }, replace) =>
        replace({
          pathname: `/question/${params.slug}`,
          hash: location.hash,
        })
      }
    />
    <Redirect from="/dash/:dashboardId" to="/dashboard/:dashboardId" />
    <Redirect
      from="/collections/permissions"
      to="/admin/permissions/collections"
    />

    {/* MISC */}
    <Route path="/unauthorized" component={Unauthorized} />
    <Route path="/*" component={LazyLoad.NotFoundFallbackPage} />
  </Route>
);
