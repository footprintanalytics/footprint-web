import React from "react";

// import { PLUGIN_LANDING_PAGE } from "metabase/plugins";
import { Route } from "metabase/hoc/Title";
import { IndexRedirect, IndexRoute } from "react-router";
import { routerActions } from "react-router-redux";
import { UserAuthWrapper } from "redux-auth-wrapper";
import { t } from "ttag";
import { loadCurrentUser, loadCurrentUserVip } from "metabase/redux/user";
import MetabaseSettings from "metabase/lib/settings";
import getAccountRoutes from "metabase/account/routes";
import getAdminRoutes from "metabase/admin/routes";
import getDeFiRoutes from "metabase/defi/routes";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import LazyLoad from "./routesLazyLoad";
import { includes } from "lodash/collection";
import { NotFound, Unauthorized } from "metabase/containers/ErrorPages";
import { trackPageView } from "./lib/analytics";
import { isProduction } from "./env";

const MetabaseIsSetup = UserAuthWrapper({
  predicate: authData => (isProduction ? !authData.hasSetupToken : true),
  failureRedirectPath: "/setup",
  authSelector: state => ({ hasSetupToken: MetabaseSettings.hasSetupToken() }), // HACK
  wrapperDisplayName: "MetabaseIsSetup",
  allowRedirectBack: false,
  redirectAction: routerActions.replace,
});

const UserIsAuthenticated = UserAuthWrapper({
  failureRedirectPath: () => {
    return `/loginModal?from=${localStorage.getItem("lastGTag")}`;
  },
  authSelector: state => {
    return state.currentUser;
  },
  wrapperDisplayName: "UserIsAuthenticated",
  redirectAction: routerActions.replace,
});
const UserIsDefiAuthenticated = UserAuthWrapper({
  failureRedirectPath: () => {
    return "/defi360";
  },
  authSelector: state => {
    return state.currentUser;
  },
  allowRedirectBack: true,
  wrapperDisplayName: "UserIsAuthenticated",
  redirectAction: routerActions.replace,
});

const UserIsDefi360 = UserAuthWrapper({
  predicate: currentUser =>
    currentUser && includes(currentUser.groups, "Defi360"),
  failureRedirectPath: () => {
    return "/defi360";
  },
  authSelector: state => state.currentUser,
  wrapperDisplayName: "UserIsDefi360",
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

const IsAuthenticated = MetabaseIsSetup(
  UserIsAuthenticated(({ children }) => children),
);
const IsDefiAuthenticated = MetabaseIsSetup(
  UserIsDefiAuthenticated(({ children }) => children),
);

const IsDefi360 = MetabaseIsSetup(
  UserIsAuthenticated(UserIsDefi360(({ children }) => children)),
);

const IsAdmin = MetabaseIsSetup(
  UserIsAuthenticated(UserIsAdmin(({ children }) => children)),
);

const IsNotAuthenticated = MetabaseIsSetup(
  UserIsNotAuthenticated(({ children }) => children),
);

export const getRoutes = store => (
  <Route
    title={t`Footprint Analytics`}
    component={LazyLoad.App}
    onEnter={nextState => {
      trackPageView(nextState.location.pathname, "Enter");
    }}
    onChange={(prevState, nextState, replace) => {
      // console.log([prevState.location.pathname, nextState.location.pathname]);

      let { pathname: prevPathname } = prevState.location;
      if (!prevPathname.startsWith("/")) {
        prevPathname = "/" + prevPathname;
      }

      let { pathname: nextPathname, hash, search } = nextState.location;
      if (!nextPathname.startsWith("/")) {
        nextPathname = "/" + nextPathname;
      }

      if (
        prevPathname.startsWith("/defi360") &&
        !nextPathname.startsWith("/defi360")
      ) {
        replace(`/defi360${nextPathname}${search}${hash}`);
      }

      if (prevPathname !== nextPathname) {
        trackPageView(nextPathname, "Change");
      }
    }}
  >
    {/* SETUP */}
    <Route
      title={t`Setup`}
      path="/setup"
      component={LazyLoad.SetupApp}
      onEnter={(nextState, replace) => {
        if (!MetabaseSettings.hasSetupToken()) {
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
        await store.dispatch(loadCurrentUser());
        if (store.getState().currentUser) {
          store.dispatch(loadCurrentUserVip());
        }
        done();
      }}
    >
      <Route path="/" component={LazyLoad.Features}>
        <IndexRedirect to="/dashboards" />
        <Route path="topic/:menu/:subMenu" />
        <ModalRoute
          title={t`Login`}
          path="loginModal"
          modal={LazyLoad.LoginModal}
          modalProps={{ className: "loginModalRoot" }}
        />
      </Route>

      <Route path="/dashboards" component={LazyLoad.Dashboards} />

      <Route
        title={t`Protocols`}
        path="/protocols"
        component={LazyLoad.Protocols}
      />

      <Route title={t`Creator`} path="/@:name" component={LazyLoad.Creator} />

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

      <Route title={t`Pricing`} path="/pricing" component={LazyLoad.Plans} />
      <Route path="/about" component={LazyLoad.About} />
      <Route title={t`ZKSpace`} path="/zkspace" component={LazyLoad.Zkspace} />
      <Route title={t`News`} path="/news" component={LazyLoad.News}>
        <IndexRoute component={LazyLoad.Featured} />
        <Route
          title={t`Featured`}
          path="featured"
          component={LazyLoad.Featured}
        />
        <Route
          title={t`Articles`}
          path="articles"
          component={props => <LazyLoad.Articles {...props} type="article" />}
        />
        <Route
          title={t`Daily News`}
          path="daily-news"
          component={props => <LazyLoad.Articles {...props} type="dailyNews" />}
        />
        <Route
          title={t`Write for Us`}
          path="write-for-us"
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
      <Route title={t`Explore`} path="/explore" component={LazyLoad.Explore}>
        <Route title={t`Dashboard`} path="dashboard/:slug">
          <ModalRoute
            title={t`Copy`}
            path="copy"
            modal={LazyLoad.DashboardCopyModal}
          />
        </Route>
      </Route>
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

      <Route component={IsAuthenticated}>
        <Route title={t`Mine`} path="mine" component={LazyLoad.My}>
          <Route title={t`Dashboard`} path="dashboard/:slug">
            <ModalRoute path="copy" modal={LazyLoad.DashboardCopyModal} />
          </Route>
        </Route>
        <Route
          title={t`Collection Users`}
          path="collection/users"
          component={IsAdmin}
        >
          <IndexRoute component={LazyLoad.UserCollectionList} />
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

        <Route
          title={t`Collection`}
          path="collection/:slug"
          component={LazyLoad.CollectionLanding}
        >
          <ModalRoute
            title={t`Edit`}
            path="edit"
            modal={LazyLoad.CollectionEdit}
          />
          <ModalRoute
            title={t`Archive`}
            path="archive"
            modal={LazyLoad.ArchiveCollectionModal}
          />
          <ModalRoute
            title={t`New Collection`}
            path="new_collection"
            modal={LazyLoad.CollectionCreate}
          />
          <ModalRoute
            title={t`New Dashboard`}
            path="new_dashboard"
            modal={LazyLoad.CreateDashboardModal}
          />
          <ModalRoute
            title={t`Permissions`}
            path="permissions"
            modal={LazyLoad.CollectionPermissionsModal}
          />
        </Route>

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

        <Route
          title={t`Question`}
          path="/question"
          component={LazyLoad.Question}
        >
          {/* <IndexRoute component={Question} /> */}
          {/* NEW QUESTION FLOW */}
          {/* <Route path="new" title={t`New query`} component={NewQueryOptions} /> */}
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

        <Route title={t`Browse`} path="browse" component={LazyLoad.BrowseApp}>
          <IndexRoute component={LazyLoad.DatabaseBrowser} />
          <Route
            title={t`Detail`}
            path=":slug"
            component={LazyLoad.SchemaBrowser}
          />
          <Route
            title={t`Schema`}
            path=":dbId/schema/:schemaName"
            component={LazyLoad.TableBrowser}
          />
        </Route>

        <Route
          path="/explore/:databaseId"
          title={t`Explore Detail`}
          component={LazyLoad.PostSetupApp}
        />

        <Route
          path="archive"
          title={t`Archive`}
          component={LazyLoad.ArchiveApp}
        />

        <Route
          title={t`Collection Users`}
          path="collection/users"
          component={IsAdmin}
        >
          <IndexRoute component={LazyLoad.UserCollectionList} />
        </Route>

        <Route
          title={t`Activity`}
          path="activity"
          component={LazyLoad.HomepageApp}
        />

        {/* INDIVIDUAL DASHBOARDS */}
        {/* <Route
          title={t`Auto Dashboard`}
          path="/auto/dashboard/*"
          component={AutomaticDashboardApp}
        /> */}
      </Route>

      {/* REFERENCE */}
      {/* <Route path="/reference" title={`Data Reference`}>
        <IndexRedirect to="/reference/databases" title={t`Databases`} />
        <Route
          title={t`Metrics`}
          path="metrics"
          component={MetricListContainer}
        />
        <Route
          title={t`Metrics Detail`}
          path="metrics/:metricId"
          component={MetricDetailContainer}
        />
        <Route
          title={t`Metrics Detail Edit`}
          path="metrics/:metricId/edit"
          component={MetricDetailContainer}
        />
        <Route
          title={t`Metrics Detail Questions`}
          path="metrics/:metricId/questions"
          component={MetricQuestionsContainer}
        />
        <Route
          title={t`Metrics Detail Revisions`}
          path="metrics/:metricId/revisions"
          component={MetricRevisionsContainer}
        />
        <Route
          title={t`Segments`}
          path="segments"
          component={SegmentListContainer}
        />
        <Route
          title={t`Segments Detail`}
          path="segments/:segmentId"
          component={SegmentDetailContainer}
        />
        <Route
          title={t`Segments fields`}
          path="segments/:segmentId/fields"
          component={SegmentFieldListContainer}
        />
        <Route
          title={t`Segments fields Detail`}
          path="segments/:segmentId/fields/:fieldId"
          component={SegmentFieldDetailContainer}
        />
        <Route
          title={t`Segments Detail Questions`}
          path="segments/:segmentId/questions"
          component={SegmentQuestionsContainer}
        />
        <Route
          title={t`Segments Detail Revisions`}
          path="segments/:segmentId/revisions"
          component={SegmentRevisionsContainer}
        />
        <Route
          title={t`Databases`}
          path="databases"
          component={DatabaseListContainer}
        />
        <Route
          title={t`Databases Detail`}
          path="databases/:databaseId"
          component={DatabaseDetailContainer}
        />
        <Route
          title={t`Databases Tables`}
          path="databases/:databaseId/tables"
          component={TableListContainer}
        />
        <Route
          title={t`Databases Tables Detail`}
          path="databases/:databaseId/tables/:tableId"
          component={TableDetailContainer}
        />
        <Route
          title={t`Databases Tables Fields`}
          path="databases/:databaseId/tables/:tableId/fields"
          component={FieldListContainer}
        />
        <Route
          title={t`Databases Tables Fields Detail`}
          path="databases/:databaseId/tables/:tableId/fields/:fieldId"
          component={FieldDetailContainer}
        />
        <Route
          title={t`Databases Tables Questions`}
          path="databases/:databaseId/tables/:tableId/questions"
          component={TableQuestionsContainer}
        />
      </Route> */}

      {/* PULSE */}
      {/* <Route path="/pulse" title={t`Pulses`}>
        <IndexRedirect
          title={t`Search`}
          to="/search"
          query={{ type: "pulse" }}
        />
        <Route title={t`Create`} path="create" component={PulseEditApp} />
        <Route title={t`Detail`} path=":pulseId">
          <IndexRoute component={PulseEditApp} />
        </Route>
      </Route> */}

      {/* ACCOUNT */}
      {getAccountRoutes(store, IsAuthenticated)}

      {/* ADMIN */}
      {getAdminRoutes(store, IsAdmin)}
    </Route>

    {/* LOGIN */}
    <Route path="/auth" component={LazyLoad.AuthApp}>
      <Route component={IsNotAuthenticated}>
        <Route path="login" title={t`Login`} component={LazyLoad.LoginApp} />
      </Route>
      <Route title={t`Logout`} path="logout" component={LazyLoad.LogoutApp} />
      <Route title={t`Regist`} path="regist" component={LazyLoad.Register} />
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

    {/* INTERNAL */}
    {/* <Route
      title={t`Internal`}
      path="/_internal"
      getChildRoutes={(partialNextState, callback) =>
        require.ensure([], function(require) {
          callback(null, [require("metabase/internal/routes").default]);
        })
      }
    /> */}

    {/* DEPRECATED */}
    {/* NOTE: these custom routes are needed because <Redirect> doesn't preserve the hash */}
    {/* <Route
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
    <Redirect from="/dash/:dashboardId" to="/dashboard/:slug" />
    <Redirect
      from="/collections/permissions"
      to="/admin/permissions/collections"
    /> */}

    {/* MISC */}
    <Route
      title={t`Unauthorized`}
      path="/unauthorized"
      component={Unauthorized}
    />

    {/* DeFi 360 */}
    {getDeFiRoutes(store, IsDefiAuthenticated, IsDefi360)}

    <Route title={t`NotFound`} path="/*" component={NotFound} />
  </Route>
);
