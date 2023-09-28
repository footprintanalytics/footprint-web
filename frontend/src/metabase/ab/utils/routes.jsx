import React from "react";
import { t } from "ttag";
import { Route } from "metabase/hoc/Title";
import LazyLoad from "../../routesLazyLoad";
import { ModalRoute } from "metabase/hoc/ModalRoute";
import { IndexRoute } from "react-router";

const getRoutes = (store, IsAuthenticated) => {
  return (
    <Route
      title={t`Growth`}
      path="/fga"
    >
      <IndexRoute
        component={LazyLoad.ABProjectContainer}
      />
      <Route
        title={t`Growth`}
        path=":businessType"
      >
        <IndexRoute
          component={LazyLoad.ABProjectContainer}
        />
        <Route
          title={t`Growth`}
          path="/project-manage"
          component={LazyLoad.GameList}
        />
        <Route
          title={t`Growth`}
          path="/bind-game"
          component={LazyLoad.bindGame}
        />
        <Route
          title={t`Pricing`}
          path="/pricing"
          component={LazyLoad.FgaPrice}
        />
        <Route
          title={t`Submit Contract`}
          path="/submit/contract/add"
          component={LazyLoad.SubmitContractAddV2}
        />

        <Route
          title={t`Submit Contract`}
          path="/submit/contract"
          component={LazyLoad.SubmitContract}
        />
        <Route
          title={t`Submit Contract`}
          path="/submit/contract/success"
          component={LazyLoad.SubmitContractSuccess}
        />
        <Route
          path="/dashboard/:slug"
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
          path="/@:name"
          component={LazyLoad.Creator}
        />
        <Route
          title={t`Dashboard`}
          path="/@:name/:dashboardName"
          component={LazyLoad.WrapDashboard}
        />
        <Route
          title={t`Dashboard`}
          path="/dashboard/@:name/:dashboardName"
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
          path="/public/dashboard/:uuid"
          component={LazyLoad.PublicDashboard}
        />
        <Route
          title={t`Create Campaign`}
          path="/campaign(/:type)"
          component={LazyLoad.CreateCampaign}
        />
        <Route
          title={t`Chart`}
          path="/guest/chart/:titleAndId"
          component={LazyLoad.GuestQuestion}
        />
        <Route
          title={t`Chart`}
          path="/public/scene/chart/:titleAndId"
          component={LazyLoad.PublicQuestion}
        />
        <Route
          title={t`Chart`}
          path="/public/widget/chart/:uuid"
          component={LazyLoad.WidgetPublic}
        />
        <Route
          title={t`Chart`}
          path="/public/chart/:titleAndId"
          component={LazyLoad.PublicQuestion}
        />
        <Route
          title={t`Question`}
          path="/chart"
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
        <Route path="project/:project(/:menu)" component={LazyLoad.ABProjectContainer}/>
      </Route>
    </Route>


  );
};

export default getRoutes;
