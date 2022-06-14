/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { withRouter } from "react-router";

import { IFRAMED, initializeIframeResizer } from "metabase/lib/dom";
import { parseHashOptions } from "metabase/lib/browser";

import TitleAndDescription from "metabase/components/TitleAndDescription";
import Parameters from "metabase/parameters/components/Parameters/Parameters";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";
import ActionButtons from "./ActionButtons";
import { DashboardLazyLoadContainer } from "../../dashboard/components/Dashboard/DashboardLazyLoadContainer";

import cx from "classnames";

import "../../public/components/EmbedFrame.css";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import { HeaderTitle } from "metabase/components/Header";
import Meta from "metabase/components/Meta";
import { ossPath } from "metabase/lib/ossPath";
import { getOssUrl } from "metabase/lib/image";
import { getDescription } from "metabase/lib/formatting";

const DEFAULT_OPTIONS = {
  bordered: IFRAMED,
  titled: true,
};

@withRouter
export default class EmbedFrame extends Component {
  state = {
    innerScroll: true,
  };

  UNSAFE_componentWillMount() {
    initializeIframeResizer(() => this.setState({ innerScroll: false }));
  }

  render() {
    const {
      uuid,
      type,
      entityId,
      creatorId,
      className,
      children,
      description,
      location,
      parameters,
      parameterValues,
      setParameterValue,
      setMultipleParameterValues,
      user,
      router,
      creator,
      createdAt,
      statistics,
      isFavorite,
      showEditButton,
      handleSideHide,
      hideSide,
      featuresMode,
      dashboard,
      result,
      card,
    } = this.props;
    const { innerScroll } = this.state;
    const { bordered, titled, theme, hide_parameters, no_params } = {
      ...DEFAULT_OPTIONS,
      ...parseHashOptions(location.hash),
    };
    const name = titled ? this.props.name : null;
    const img = ossPath(`${type}/${entityId}.png`);

    const canEdit =
      user &&
      (user.is_superuser || user.isMarket || user.id === dashboard?.creator_id);

    const uniqueName = dashboard && dashboard.uniqueName;

    return (
      <div
        className={cx("flex flex-column relative", className, {
          "bordered rounded shadowed": bordered,
          [`Theme--${theme}`]: !!theme,
        })}
        style={{ height: `calc(100vh - 60px)` }}
      >
        <Meta
          description={getDescription({
            description,
            orderedCards: dashboard?.ordered_cards,
          })}
          image={getOssUrl(img, { resize: true })}
        />
        <div
          className={cx("flex flex-column flex-full relative", {
            "scroll-y": innerScroll,
          })}
        >
          <div className="DashboardHeader">
            <div className="EmbedFrame-header flex align-baseline">
              {name && (
                // <TitleAndDescription title={name} description={description} />
                <HeaderTitle
                  router={router}
                  handleSideHide={handleSideHide}
                  hideSide={hideSide}
                  featuresMode={featuresMode}
                  titleAndDescription={
                    <TitleAndDescription
                      title={name}
                      description={description}
                    />
                  }
                  titleRightPanel={
                    <DashboardCardDisplayInfo
                      authorName={creator && creator.name}
                      date={createdAt}
                      favorite={statistics && statistics.favorite}
                      read={statistics && statistics.view}
                    />
                  }
                />
              )}

              {name && (
                <ActionButtons
                  name={name}
                  entityId={entityId}
                  uuid={uuid}
                  type={type}
                  creatorId={creatorId}
                  statistics={statistics}
                  isFavorite={isFavorite}
                  showEditButton={showEditButton}
                  uniqueName={uniqueName}
                  creator={creator}
                  result={result}
                  card={card}
                />
              )}
            </div>
          </div>
          <div
            className={`flex-full flex flex-column flex-basis-none ${
              type === "card" ? "bg-white" : ""
            }`}
          >
            <DashboardLazyLoadContainer className="flex flex-column relative full">
              <div className="bg-white pl2 pr2 html2canvas-filter">
                {entityId && (
                  <TagsPanel
                    type={type}
                    tagEntityId={entityId}
                    isEditPermission={!!canEdit}
                  />
                )}
                {parameters && parameters.length > 0 && (
                  <div
                    className="flex align-center"
                    style={{
                      display: no_params ? "none" : "",
                      margin: "12px 0",
                    }}
                  >
                    <Parameters
                      dashboard={dashboard}
                      parameters={parameters.map(p => ({
                        ...p,
                        value: parameterValues && parameterValues[p.id],
                      }))}
                      query={location.query}
                      setParameterValue={setParameterValue}
                      setMultipleParameterValues={setMultipleParameterValues}
                      syncQueryString
                      hideParameters={hide_parameters}
                      isQB
                      isPublic={false}
                      auth={!!user}
                    />
                  </div>
                )}
              </div>
              <div className="wrapper flex-full flex flex-column flex-basis-none">
                {children}
              </div>
            </DashboardLazyLoadContainer>
          </div>
        </div>
      </div>
    );
  }
}
