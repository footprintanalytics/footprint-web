/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";

import _ from "underscore";
import { debounce, isArray, startCase } from "lodash";
import { Breadcrumb, Select } from "antd";
import { IFRAMED } from "metabase/lib/dom";
import Tooltip from "metabase/components/Tooltip";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import DashboardGrid from "metabase/dashboard/components/DashboardGrid";
import DashboardControls from "metabase/dashboard/hoc/DashboardControls";
import { getDashboardActions } from "metabase/dashboard/components/DashboardActions";
import title from "metabase/hoc/Title";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { setErrorPage } from "metabase/redux/app";
import { getMetadata } from "metabase/selectors/metadata";
import { parseHashOptions } from "metabase/lib/browser";

import PublicMode from "metabase/modes/components/modes/PublicMode";

import {
  getCardData,
  getDashboardComplete,
  getParameters,
  getParameterValues,
  getSlowCards,
} from "metabase/dashboard/selectors";

import * as dashboardActions from "metabase/dashboard/actions";

import { setEmbedDashboardEndpoints, setPublicDashboardEndpoints } from "metabase/services";
import { parseTitleId } from "metabase/lib/urls";
import {
  getDefaultDashboardPara,
  getFirstAddressByPriory,
  isFgaPath,
  updateDashboardPara,
} from "metabase/growth/utils/utils";
import { canShowDarkMode } from "metabase/dashboard/components/utils/dark";
import EmbedFrame from "../components/EmbedFrame";
import Button from "metabase/core/components/Button/Button";
import { loginModalShowAction } from "metabase/redux/control";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { getFgaChartTypeStatus, getUser } from "metabase/selectors/user";
import { getSqlAndJumpToDoc, replaceTemplateCardUrl } from "metabase/guest/utils";
import { trackStructEvent } from "metabase/lib/analytics";
import { isABPath, isBusinessTypePath, isFGAVCPath } from "metabase/ab/utils/utils";
import { refreshCurrentUser } from "metabase/redux/user";
import Link from "metabase/core/components/Link";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { getFgaFlowType } from "metabase/ab/utils/mapping-utils";

const mapStateToProps = (state, props) => {
  const user = getUser(state);
  const parameters = getParameters(state, props);
  const parameterValues = getParameterValues(state, props);
  const project = props.project;
  const projectList = props.projectList;
  const chain = props.chain;
  const location = props.location;
  const favoriteList = props.favoriteList;
  const isDataApiStatistics = props.isDataApiStatistics;
  const filterChainFunction = item => !(isABPath() && isBusinessTypePath("public-chain")) || item.chain === chain;
  if (project) {
    let projectProtocolSlug = project?.protocolSlug;
    let projectProtocolName = project?.protocolName;
    let id = project?.id;
    /*if (projectProtocolName === "Demo Project") {
      id = 1;
    }*/
    if (projectProtocolSlug === "Demo Project") {
      projectProtocolSlug = "the-sandbox";
    }
    /*if (projectProtocolName === "Demo Project") {
      projectProtocolName = "The Sandbox";
    }*/
    if (projectProtocolSlug === "Gaming Demo Project") {
      projectProtocolSlug = "gamee";
    }
    if (projectProtocolSlug === "Gaming Demo Project 2") {
      // projectProtocolSlug = "phantom-galaxies";
      projectProtocolSlug = "the-sandbox";
    }
    if (projectProtocolSlug === "Metaverse Demo Project") {
      projectProtocolSlug = "the-sandbox";
    }
    if (props.project?.walletRetentionChain && location?.pathname?.includes("wallet_retention")) {
      updateDashboardPara(parameters, parameterValues, "chain", [
        props.project?.walletRetentionChain,
      ]);
    }
    let currentChain = null;
    // switch protocol
    if (id) {
      const type = parameters?.find(parameter => parameter.slug === "project_id")?.type
      let projectIdValue = id
      if (type === "string/=") {
        projectIdValue = `${id}`
      }
      updateDashboardPara(parameters, parameterValues, "project_id", [
        projectIdValue,
      ]);
    }
    updateDashboardPara(parameters, parameterValues, "gamefi", [
      projectProtocolSlug,
    ]);
    updateDashboardPara(parameters, parameterValues, "protocol_slug", [
      projectProtocolSlug,
    ]);
    updateDashboardPara(parameters, parameterValues, "project_name", [
      projectProtocolName,
    ]);
    // updateDashboardPara(parameters, parameterValues, "protocol_slug_list", projectList?.map(item => item?.protocolSlug));
    /*if (isABPath()) {
      updateDashboardPara(parameters, parameterValues, "chain", [
        chain,
      ]);
    }*/
    if (project.tokenAddress?.filter(filterChainFunction)?.length > 0) {
      const key = "token_address";
      const data = getFirstAddressByPriory(project.tokenAddress?.filter(filterChainFunction));
      let queryCollection = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      queryCollection =
        queryCollection &&
        project.tokenAddress.findIndex(t => t?.address === queryCollection) !==
          -1
          ? queryCollection
          : data?.address;
      if (
        updateDashboardPara(parameters, parameterValues, key, queryCollection)
      ) {
        currentChain = project.tokenAddress.find(
          item => item?.address === queryCollection,
        ).chain;
      }
    }
    if (project.template) {
      const key = "tag";
      const queryCollection = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      const tags = [project.template].concat(queryCollection ?? []);
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        tags.filter((item, index) => tags.indexOf(item) === index),
      );
    }
    if (project.nftCollectionAddress?.filter(filterChainFunction)?.length > 0) {
      const firstAddress = getFirstAddressByPriory(
        project.nftCollectionAddress?.filter(filterChainFunction),
      );
      const key = "collection_contract_address";
      let queryCollection = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      queryCollection =
        queryCollection &&
        project.nftCollectionAddress?.filter(filterChainFunction).findIndex(
          item => item?.address === queryCollection,
        ) !== -1
          ? queryCollection
          : firstAddress?.address;
      if (
        updateDashboardPara(parameters, parameterValues, key, queryCollection)
      ) {
        currentChain = project.nftCollectionAddress?.filter(filterChainFunction).find(
          item => item?.address === queryCollection,
        ).chain;
      }
    }
    // mutiple collection
    if (project.nftCollectionAddress?.length > 0) {
      const key = "collection_contract_addresses";
      const mutipleCollection = project.nftCollectionAddress?.filter(filterChainFunction).map(item => {
        return item?.address;
      });
      updateDashboardPara(parameters, parameterValues, key, mutipleCollection);
    }
    /*if (project.nftCollectionAddress?.length > 0) {
      const key = "contract_collection";
      const mutipleCollection = project.nftCollectionAddress.map(item => {
        return item.address;
      });
      updateDashboardPara(parameters, parameterValues, key, mutipleCollection[0]);
    }*/
    if (project.twitter_handler) {
      const key = "twitter_handler";
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.twitter_handler,
      );
    }
    if (project.discord_guild_id) {
      updateDashboardPara(
        parameters,
        parameterValues,
        "project_name",
        project.protocolName,
      );
      updateDashboardPara(
        parameters,
        parameterValues,
        "guild_id",
        project.discord_guild_id,
      );
    }
    if (project.campaignTitle) {
      const key = "campaign_title";
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.campaignTitle,
      );
    }
    // switch chain
    currentChain =
      currentChain ??
      getFirstAddressByPriory(project.tokenAddress)?.chain ??
      getFirstAddressByPriory(project.nftCollectionAddress?.filter(filterChainFunction))?.chain;
    if (currentChain) {
      const key = "chain";
      const defaultQuerryChain = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      const chainList = [];
      project.tokenAddress.concat(project.nftCollectionAddress?.filter(filterChainFunction)).map(item => {
        if (chainList.findIndex(t => t === item.chain) === -1) {
          chainList.push(item.chain);
        }
      });
      // if defaultQuerryChain is not in chainList, set defaultQuerryChain to currentChain
      const querryChain =
        defaultQuerryChain &&
        chainList.findIndex(t =>
          t.chain === isArray(defaultQuerryChain)
            ? defaultQuerryChain[0]
            : defaultQuerryChain,
        ) !== -1
          ? defaultQuerryChain
          : currentChain;
      updateDashboardPara(parameters, parameterValues, key, querryChain);
    }
  }
  if (isDataApiStatistics) {
    updateDashboardPara(parameters, parameterValues, "user_id", `${user.id}`)
  }
  return {
    metadata: getMetadata(state, props),
    project: props.project,
    header: props.header,
    hideAllParams: props.hideAllParams,
    hideTitle: props.hideTitle,
    dashboardId:
      props.params.dashboardId ||
      parseTitleId(props.params.uuid || props.params.token).id,
    dashboard: getDashboardComplete(state, props),
    dashcardData: getCardData(state, props),
    slowCards: getSlowCards(state, props),
    parameters: parameters,
    parameterValues: parameterValues,
    user: getUser(state),
    chartTypeStatus: getFgaChartTypeStatus(state),
    filterChainFunction: filterChainFunction,
  };
};

const mapDispatchToProps = {
  ...dashboardActions,
  fetchDatabaseMetadata,
  setErrorPage,
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  refreshCurrentUser,
};

// NOTE: this should use DashboardData HoC
class PublicDashboard extends Component {
  constructor() {
    super();
    this.state = {
      cardId: "",
      cardName: "",
    };
  }

  // 获取需要请求的 card id， null表示都需要，[1]表示1的card需要请求
  getNeedRequestCardIds = (props) => {
    const isProFga = window.location.pathname.startsWith("/fga/pro")
    if (!isProFga) {
      return null
    }
    return props.dashboard?.ordered_cards?.map(card => {
      const flowType = getFgaFlowType(props.user, props.project, card.card_id, props.chartTypeStatus)
      if (flowType && (flowType === "normal" || flowType === "")) {
        return card.card_id
      }
    }).filter(Boolean)
  }

  _fetchDashboardCardData = debounce(
    (params = {}) => {
      const cardIds = this.getNeedRequestCardIds(this.props)
      const { ignore_cache } = {
        ...parseHashOptions(location.hash),
      };
      this.props.fetchDashboardCardData({
        reload: false,
        clear: true,
        ignoreCache: params.ignoreCache || this.props.ignoreCache || !!ignore_cache,
        cardIds: cardIds,
      });
    },
    100,
    {
      leading: false,
      trailing: true,
    },
  );

  getFgaMultiKeyObject = () => {
    if (isABPath()) {
      const needMultiSelectHeaderSlugs = ["contract_address", "collection_contract_address", "asset_address", "asset_contract_address", "contract_collection"];
      return this.props.parameters.find(item => needMultiSelectHeaderSlugs.includes(item.slug));
    }
    return null;
  }
  getFgaMultiKeyProject = () => {
    if (isABPath()) {
      const needMultiSelectHeaderSlugs = ["project_list"];
      return this.props.parameters.find(item => needMultiSelectHeaderSlugs.includes(item.slug));
    }
    return null;
  }

  getFgaMultiKeyObjectAsset = () => {
    if (isABPath()) {
      const needMultiSelectHeaderSlugs = ["asset_address", "asset_contract_address"];
      return this.props.parameters.find(item => needMultiSelectHeaderSlugs.includes(item.slug));
    }
    return null;
  }

  getFgaMultiKeyObjectToken = () => {
    if (isABPath()) {
      const needMultiSelectHeaderSlugs = ["token_contract_address"];
      return this.props.parameters.find(item => needMultiSelectHeaderSlugs.includes(item.slug));
    }
    return null;
  }

  _initialize = async () => {
    const {
      initialize,
      fetchDashboard,
      setErrorPage,
      location,
      filterChainFunction,
      params: { dashboardId, uuid, token },
    } = this.props;
    let publicUuid;
    if (!dashboardId) {
      publicUuid = parseTitleId(uuid).id;
      if (publicUuid) {
        setPublicDashboardEndpoints();
      } else if (token) {
        setEmbedDashboardEndpoints();
      }
    }
    initialize();
    try {
      await fetchDashboard(dashboardId || publicUuid || token, location.query);

      this._fetchDashboardCardData();

      const keyObject = this.getFgaMultiKeyObject();
      if (keyObject) {
        this.props.setParameterValue(keyObject.id, this.getDefaultNftCollectionAddress())
      }
      const keyObjectToken = this.getFgaMultiKeyObjectToken();
      if (keyObjectToken) {
        this.props.setParameterValue(keyObjectToken.id, this.props.project.tokenAddress[0]?.address)
      }
      const keyProject = this.getFgaMultiKeyProject();
      if (keyProject) {
        const array = this.props.projectList.length > 1 ? this.props.projectList.filter(i => !i.isDemo).map(i => i.protocolSlug) : ["the-sandbox"]
        this.props.setParameterValue(keyProject.id, array)
      }
      // const keyObjectAsset = this.getFgaMultiKeyObjectAsset();
      // if (keyObjectAsset) {
      //   this.props.setParameterValue(keyObjectAsset.id, this.props.project.nftCollectionAddress[0].address)
      // }
    } catch (error) {
      console.error(error);
      setErrorPage(error);
    }
  };
  parentMessageAction = (event) => {
    // 可以检查 event.origin 来验证消息的发送者是否可信
    if (event?.origin === window?.location?.origin && event?.data && (typeof event?.data === "string")) {
      if (event?.data?.startsWith("user=")) {
        this.props.refreshCurrentUser(JSON.parse(event.data.slice(5)))
      }
      if (event?.data?.startsWith("action=")) {
        const action = event.data.slice(7)
        switch (action) {
          case "setLoginModalShow":
            this.props.setLoginModalShow({ show: true });
            break;
        }
      }
    }
  }
  async componentDidMount() {
    this._initialize();
    window.addEventListener('message', this.parentMessageAction);
  }

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();
    window.removeEventListener('message', this.parentMessageAction);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.dashboardId !== prevProps.dashboardId) {
      return this._initialize();
    }
    if (!_.isEqual(this.props.parameterValues, prevProps.parameterValues)) {
      this._fetchDashboardCardData();
    }
    // 只有 fga/pro 需要做判断是否重新刷新
    const isProFga = window.location.pathname.startsWith("/fga/pro")
    if (isProFga && !_.isEqual(this.getNeedRequestCardIds(this.props), this.getNeedRequestCardIds(prevProps))) {
      this._fetchDashboardCardData();
    }
  }

  renderRefreshButton = () => {
    return (
      <Tooltip
        key="refreshCache"
        tooltip={
          <div className="align-center" style={{ margin: "0 auto" }}>
            Refresh cache <br />
            (Once in a minute)
          </div>
        }
      >
        <Button
          onlyIcon
          className="Question-header-btn"
          iconColor="#7A819B"
          icon={"refresh"}
          iconSize={16}
          style={{
            position: "fixed",
            right: "40px",
            top: "100px",
            zIndex: 2,
          }}
          onClick={() => {
            if (!this.props.user) {
              this.props.setLoginModalShow({
                show: true,
                from: "research",
              });
              return
            }
            this._fetchDashboardCardData({ ignoreCache: true });
          }}
        />
      </Tooltip>
    );
  };

  duplicateAction = async item => {
    trackStructEvent(`dashcard click duplicate`);
    if (this.props.user) {
      this.setState({
        cardId: item.id,
        cardName: item.name,
      });
    } else {
      this.props.setLoginModalShow({
        show: true,
        from: "publicDashboard_query_duplicate",
      });
    }
  };

  previewAction = (cardId) => {
    trackStructEvent(`dashcard click preview`);
    if (this.props.user) {
      replaceTemplateCardUrl(this.props, cardId);
    } else {
      this.props.setLoginModalShow({
        show: true,
        from: "publicDashboard_query_preview",
      });
    }
  };

  getDataViaSqlApiAction = ({ cardId, dashcardId, dashboardId }) => {
    trackStructEvent(`dashcard click get-data-via-sql-api`);
    if (this.props.user) {
      getSqlAndJumpToDoc(this.props, { cardId, dashcardId, dashboardId });
    } else {
      window?.parent?.postMessage("action=setLoginModalShow", window.location.origin);
      this.props.setLoginModalShow({
        show: true,
        from: "publicDashboard_get_data_via_sql_api",
      });
    }
  }
  getDefaultNftCollectionAddress() {
    const {
      project,
      filterChainFunction,
    } = this.props
    const array = project?.nftCollectionAddress?.filter(filterChainFunction)
    let defaultNftCollectionAddress = array?.[0]?.address
    /*const storageAddress = window.localStorage.getItem(`${project?.projectName}-nftCollectionAddress`)
    if (storageAddress && array?.map(i => i.address)?.includes(storageAddress)) {
      defaultNftCollectionAddress = storageAddress
    }*/
    return defaultNftCollectionAddress
  }

  handleFgaMultiAddressUiSelectHeader = (type, keyObject) => {
    let {
      project,
      filterChainFunction,
      projectList,
    } = this.props;
    let data = [];
    let optionKey = "";
    let width = 420;
    let extraInfoKeys = [];
    let changeCallback = null;
    let defaultValue = null;
    if (type === "token") {
      data = project?.tokenAddress?.filter(filterChainFunction)
      optionKey = "address";
    } else if (type === "asset") {
      data = [...(project?.tokenAddress?.filter(filterChainFunction) || []), ...(project?.nftCollectionAddress?.filter(filterChainFunction) || [])];
      optionKey = "address";
    } else if (type === "project") {
      data = this.props.projectList.length > 1 ? projectList
        .filter(i => !i.isDemo) : [{projectName: "the-sandbox"}];
      optionKey = "projectName"
    } else {
      data = project?.nftCollectionAddress?.filter(filterChainFunction);
      extraInfoKeys = ["chain"];
      optionKey = "address";
      width = 520;
      changeCallback = (e) => {
        window.localStorage.setItem(`${this.props.project?.projectName}-nftCollectionAddress`, e)
      }
      defaultValue = this.getDefaultNftCollectionAddress();
    }
    return (<div className="flex flex-column p2" style={{ background: "#0F0F14" }}>
      <span className="text-white" style={{ marginBottom: 4 }}>{startCase(keyObject.slug)}</span>
      <span><Tooltip title="sss"></Tooltip></span>
      <Select
        mode={type === "project" ? "multiple": "" }
        defaultValue={defaultValue || data?.[0]?.[optionKey]}
        style={{
          width: width,
        }}
        maxTagCount={"responsive"}
        onChange={value => {
          if (type === "project") {
            this.props.setParameterValue(keyObject.id, value.map(v => projectList?.find(i => i.projectName === v).protocolSlug))
          } else {
            this.props.setParameterValue(keyObject.id, value)
          }
          changeCallback?.(value)
        }}
        options={_.uniq(data?.map(item => {
          const extraInfo = extraInfoKeys.map(key => {
            return `${item[key]} |`
          }).join(" ")
          return {
            value: item[optionKey],
            label: `${extraInfo} ${item[optionKey]}`,
          }
        }), "value")}
      />
    </div>)
  }

  render() {
    let {
      dashboard,
      parameters,
      parameterValues,
      isFullscreen,
      isNightMode,
      project,
      header,
      hideFooter,
      hideTitle,
      hideAllParams,
      hideParameters,
      hideParametersOuter,
      allLoadOuter,
      disableBreadcrumb,
      className,
      innerClassName,
      router,
      showRefreshButton,
      setLoginModalShow,
      user,
    } = this.props;
    const buttons = !IFRAMED
      ? getDashboardActions(this, { ...this.props, isPublic: true })
      : [];

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };

    let hideParametersForCustom = "";

    if (isFgaPath()) {
      hideParametersForCustom = "gamefi,protocol_slug,twitter_handler,project_name,guild_id";
    }
    if (isABPath()) {
      hideParametersForCustom = "gamefi,protocol_slug,twitter_handler,project_name,guild_id,project,collection_contract_address,asset_address,asset_contract_address,chain,project_id";
    }
    const hashData = parseHashOptions(location?.hash);

    //fga multi select header
    const keyObject = this.getFgaMultiKeyObject();
    if (keyObject) {
      header = !_.isEmpty(project?.nftCollectionAddress) && this.handleFgaMultiAddressUiSelectHeader("nft", keyObject);
      hideParametersForCustom = `${hideParametersForCustom},${keyObject.slug}`;
    }
    const keyObjectToken = this.getFgaMultiKeyObjectToken();
    if (keyObjectToken) {
      header = !_.isEmpty(project?.tokenAddress) && this.handleFgaMultiAddressUiSelectHeader("token", keyObjectToken);
      hideParametersForCustom = `${hideParametersForCustom},${keyObjectToken.slug}`;
    }
    const keyProject = this.getFgaMultiKeyProject();
    if (keyProject) {
      header = this.handleFgaMultiAddressUiSelectHeader("project", keyProject);
      hideParametersForCustom = `${hideParametersForCustom},${keyProject.slug}`;
    }
    // fga pro 路径下，如果 advanced plan 过期，就显示一个popup todo

    // const keyObjectAsset = this.getFgaMultiKeyObjectAsset();
    // if (keyObjectAsset) {
    //   header = this.handleFgaMultiAddressUiSelectHeader("asset", keyObjectAsset);
    //   hideParametersForCustom = `${hideParametersForCustom},${keyObjectAsset.slug}`;
    // }

    //game-portfolio
    /*if (isABPath() && (this.props.favoriteList?.length || 0) === 0) {
      header = <div style={{ padding: "10px 20px", color: "white" }}>Please select your {" "}
        <Link
          className="text-underline text-underline-hover"
          onClick={event => {
            if (!user) {
              event.preventDefault();
              setLoginModalShow({
                show: true,
                from: "dashboard-set-favorite-list",
                redirect: "/fga/game-portfolio/project-manage",
                channel: "FGA",
              });
            } else {
              router?.push("/fga/game-portfolio/project-manage");
            }
          }}
        >
          favorite project list
        </Link>
        {" "} and then can analyze your projects.</div>
    }*/
    if (
      isFgaPath() &&
      hashData?.from &&
      dashboard &&
      !disableBreadcrumb
    ) {
      header = (
        <>
          <Breadcrumb
            className="pl1 pt2"
            items={[
              {
                title: (
                  <a
                    onClick={() => {
                      router?.goBack();
                    }}
                  >
                    {hashData?.from}
                  </a>
                ),
              },
              {
                title: dashboard && dashboard.name,
              },
            ]}
          />
          {header}
        </>
      );
      hideTitle = true;
    }
    if (hideAllParams) {
      parameters.map((para, index) => {
        hideParametersForCustom = hideParametersForCustom + (index !== 0 ? "," : "") + para.slug;
      });
    }
    const shouldRenderAsNightMode = isNightMode || canShowDarkMode(dashboard);

    const { all_load, bg_color, hide_title } = {
      ...parseHashOptions(location.hash),
    };

    const backgroundColor = bg_color === "black" ? "black": "";

    const showAPITip = false;

    return (
      <EmbedFrame
        name={dashboard && dashboard.name}
        description={dashboard && dashboard.description}
        dashboard={dashboard}
        parameters={parameters}
        hideParameters={hideParametersOuter || hideParameters || hideParametersForCustom}
        hideTitle={hideTitle || hide_title}
        headerLayout={header}
        parameterValues={parameterValues}
        setParameterValue={this.props.setParameterValue}
        actionButtons={
          buttons.length > 0 && <div className="flex">{buttons}</div>
        }
        isNightMode={shouldRenderAsNightMode}
        hideFooter={hideFooter || isFgaPath() || isABPath() || isFGAVCPath()}
        className={cx(className, (isFgaPath() || isABPath() || isFGAVCPath()) && "ml-250 mt-60")}
        innerClassName={cx(innerClassName)}
        allLoadOuter={allLoadOuter}
      >
        <>
          <LoadingAndErrorWrapper
            className={cx("Dashboard p1 flex-full", {
              "Dashboard--fullscreen": isFullscreen,
              "Dashboard--night": shouldRenderAsNightMode,
            })}
            style={{ backgroundColor: backgroundColor }}
            loading={!dashboard}
          >
            {() => (
              <>
              <DashboardGrid
                {...this.props}
                className="spread"
                mode={PublicMode}
                metadata={this.props.metadata}
                navigateToNewCardFromDashboard={() => {}}
                hideWatermark={isABPath() || isFGAVCPath() || (dashboard && dashboard.hideWatermark)}
                chartStyle={chart_style}
                isNightMode={shouldRenderAsNightMode}
                duplicateAction={this.duplicateAction}
                previewAction={this.previewAction}
                getDataViaSqlApiAction={this.getDataViaSqlApiAction}
                allLoad={allLoadOuter || !!all_load}
              />
                {showAPITip && (
                  <div className={"flex justify-end pr2 pb3 pt2"}>
                    <div className="text-white" style={{fontSize: 18}}>Get This Data With {" "}
                      <Link to={"https://docs.footprint.network/reference/introduction"} className={"text-underline text-underline-hover"} target={"_blank"} style={{fontSize: 20, color: "#6C70FF"}}>
                        Footprint Analytics API
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </LoadingAndErrorWrapper>
          {showRefreshButton && !!dashboard && this.renderRefreshButton()}
          <QueryCopyModal
            open={this.state.cardId}
            cardId={this.state.cardId}
            name={this.state.cardName}
            onClose={() =>
              this.setState({
                cardId: null,
              })
            }
          />
        </>
      </EmbedFrame>
    );
  }
}

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  title(
    ({ disableUpdateTitle, dashboard }) =>
      !disableUpdateTitle && dashboard && dashboard.name,
  ),
  MetaViewportControls,
  DashboardControls,
)(PublicDashboard);
