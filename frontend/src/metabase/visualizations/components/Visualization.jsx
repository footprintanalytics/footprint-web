/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { t, jt } from "ttag";
import { assoc } from "icepick";
import _ from "underscore";
import cx from "classnames";
import { get } from "lodash";
import { Avatar, Button } from "antd";
import ExplicitSize from "metabase/components/ExplicitSize";
import ChartCaption from "metabase/visualizations/components/ChartCaption";
import ChartTooltip from "metabase/visualizations/components/ChartTooltip";
import ChartClickActions from "metabase/visualizations/components/ChartClickActions";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import { duration, formatNumber } from "metabase/lib/formatting";
import * as MetabaseAnalytics from "metabase/lib/analytics";

import {
  getVisualizationTransformed,
  extractRemappings,
} from "metabase/visualizations";
import { getComputedSettingsForSeries } from "metabase/visualizations/lib/settings/visualization";
import { isSameSeries } from "metabase/visualizations/lib/utils";
import { performDefaultAction } from "metabase/visualizations/lib/action";
import { getFont } from "metabase/styled-components/selectors";

import { getMode } from "metabase/modes/lib/modes";
import Utils from "metabase/lib/utils";

import {
  MinRowsError,
  ChartSettingsError,
} from "metabase/visualizations/lib/errors";

export const ERROR_MESSAGE_GENERIC = t`There was a problem displaying this chart.`;
export const ERROR_MESSAGE_PERMISSION = t`Sorry, you don't have permission to see this card.`;

import TableChartInfo from "metabase/query_builder/components/TableChartInfo";
import Link from "metabase/core/components/Link";
import { getOssUrl } from "metabase/lib/image";
import ErrorGuide from "metabase/query_builder/components/ErrorGuide";
import CreateCampaign from "metabase/growth/components/buttons/CreateCampaign";
import CreateCohort from "metabase/growth/components/buttons/CreateCohort";
import SocialConnect from "metabase/growth/components/buttons/SocialConnect";
import CreateFliterCohort from "metabase/growth/components/buttons/CreateFliterCohort";
import FgaErrorGuide from "metabase/growth/components/FgaErrorGuide";
import { datasetContainsNoResults } from "metabase-lib/queries/utils/dataset";
import Question from "metabase-lib/Question";
import Mode from "metabase-lib/Mode";
import { memoizeClass } from "metabase-lib/utils";
import { VisualizationSlowSpinner } from "./Visualization.styled";
import "./Visualization.css";

// NOTE: pass `CardVisualization` so that we don't include header when providing size to child element

class Visualization extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null,
      clicked: null,
      error: null,
      warnings: [],
      yAxisSplit: null,
      series: null,
      visualization: null,
      computedSettings: {},
    };
  }

  static defaultProps = {
    showTitle: false,
    isDashboard: false,
    isEditing: false,
    isSettings: false,
    isQueryBuilder: false,
    hideWatermark: false,
    onUpdateVisualizationSettings: () => {},
    // prefer passing in a function that doesn't cause the application to reload
    onChangeLocation: location => {
      window.location = location;
    },
  };

  UNSAFE_componentWillMount() {
    this.transform(this.props);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      !isSameSeries(newProps.rawSeries, this.props.rawSeries) ||
      !Utils.equals(newProps.settings, this.props.settings) ||
      !Utils.equals(newProps.timelineEvents, this.props.timelineEvents) ||
      !Utils.equals(
        newProps.selectedTimelineEventIds,
        this.props.selectedTimelineEventIds,
      )
    ) {
      this.transform(newProps);
    }
  }

  componentDidMount() {
    this.updateWarnings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !Utils.equals(this.getWarnings(prevProps, prevState), this.getWarnings())
    ) {
      this.updateWarnings();
    }
  }

  componentDidCatch(error, info) {
    console.error("Error caught in <Visualization>", error, info);
    this.setState({
      error: new Error("An error occurred displaying this visualization."),
    });
  }

  // NOTE: this is a PureComponent
  // shouldComponentUpdate(nextProps, nextState) {
  // }

  getWarnings(props = this.props, state = this.state) {
    let warnings = state.warnings || [];
    // don't warn about truncated data for table since we show a warning in the row count
    if (state.series && state.series[0].card.display !== "table") {
      warnings = warnings.concat(
        props.rawSeries
          .filter(s => s.data && s.data.rows_truncated != null)
          .map(
            s =>
              t`Data truncated to ${formatNumber(s.data.rows_truncated)} rows.`,
          ),
      );
    }
    return warnings;
  }

  updateWarnings() {
    if (this.props.onUpdateWarnings) {
      this.props.onUpdateWarnings(this.getWarnings() || []);
    }
  }

  transform(newProps) {
    const transformed = newProps.rawSeries
      ? getVisualizationTransformed(extractRemappings(newProps.rawSeries))
      : null;
    const series = transformed && transformed.series;
    const visualization = transformed && transformed.visualization;
    const computedSettings = series
      ? getComputedSettingsForSeries(series)
      : null;
    this.setState({
      hovered: null,
      //clicked: null,
      error: null,
      warnings: [],
      yAxisSplit: null,
      series: series,
      visualization: visualization,
      computedSettings: computedSettings,
    });
  }

  isLoading = series => {
    return !(
      series &&
      series.length > 0 &&
      _.every(
        series,
        s => s.data || _.isObject(s.card.visualization_settings.virtual_card),
      )
    );
  };

  handleHoverChange = hovered => {
    if (hovered) {
      const { yAxisSplit } = this.state;
      // if we have Y axis split info then find the Y axis index (0 = left, 1 = right)
      if (yAxisSplit) {
        const axisIndex = _.findIndex(yAxisSplit, indexes =>
          _.contains(indexes, hovered.index),
        );
        hovered = assoc(hovered, "axisIndex", axisIndex);
      }
      this.setState({ hovered });
      // If we previously set a timeout for clearing the hover clear it now since we received
      // a new hover.
      if (this._resetHoverTimer !== null) {
        clearTimeout(this._resetHoverTimer);
        this._resetHoverTimer = null;
      }
    } else {
      // When reseting the hover wait in case we're simply transitioning from one
      // element to another. This allows visualizations to use mouseleave events etc.
      this._resetHoverTimer = setTimeout(() => {
        this.setState({ hovered: null });
        this._resetHoverTimer = null;
      }, 0);
    }
  };

  _getQuestionForCardCached(metadata, card) {
    if (!metadata || !card) {
      return;
    }
    const { isQueryBuilder, queryBuilderMode } = this.props;
    const question = new Question(card, metadata);

    // Datasets in QB should behave as raw tables opened in simple mode
    // composeDataset replaces the dataset_query with a clean query using the dataset as a source table
    // Ideally, this logic should happen somewhere else
    return question.isDataset() &&
      isQueryBuilder &&
      queryBuilderMode !== "dataset"
      ? question.composeDataset()
      : question;
  }

  getMode(maybeModeOrQueryMode, question) {
    if (maybeModeOrQueryMode instanceof Mode) {
      return maybeModeOrQueryMode;
    }

    if (question && maybeModeOrQueryMode) {
      return new Mode(question, maybeModeOrQueryMode);
    }

    if (question) {
      return getMode(question);
    }
  }

  getClickActions(clicked) {
    if (!clicked) {
      return [];
    }
    const { metadata, getExtraDataForClick = () => ({}) } = this.props;
    // TODO: push this logic into Question?
    const seriesIndex = clicked.seriesIndex || 0;
    const card = this.state.series[seriesIndex].card;
    const question = this._getQuestionForCardCached(metadata, card);
    const mode = this.getMode(this.props.mode, question);

    return mode
      ? mode.actionsForClick(
          { ...clicked, extraData: getExtraDataForClick(clicked) },
          {},
        )
      : [];
  }

  visualizationIsClickable = clicked => {
    const { onChangeCardAndRun } = this.props;
    if (!onChangeCardAndRun) {
      return false;
    }
    try {
      return this.getClickActions(clicked).length > 0;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };

  handleVisualizationClick = clicked => {
    const { handleVisualizationClick } = this.props;

    if (clicked) {
      MetabaseAnalytics.trackStructEvent(
        "Actions",
        "Clicked",
        `${clicked.column ? "column" : ""} ${clicked.value ? "value" : ""} ${
          clicked.dimensions ? "dimensions=" + clicked.dimensions.length : ""
        }`,
      );
    }

    if (typeof handleVisualizationClick === "function") {
      handleVisualizationClick(clicked);
      return;
    }

    const didPerformDefaultAction = performDefaultAction(
      this.getClickActions(clicked),
      {
        dispatch: this.props.dispatch,
        onChangeCardAndRun: this.handleOnChangeCardAndRun,
      },
    );

    if (didPerformDefaultAction) {
      return;
    }

    // needs to be delayed so we don't clear it when switching from one drill through to another
    setTimeout(() => {
      this.setState({ clicked });
    }, 100);
  };

  // Add the underlying card of current series to onChangeCardAndRun if available
  handleOnChangeCardAndRun = ({ nextCard, seriesIndex, objectId }) => {
    const { series, clicked } = this.state;

    const index = seriesIndex || (clicked && clicked.seriesIndex) || 0;
    const previousCard = series && series[index] && series[index].card;

    this.props.onChangeCardAndRun({ nextCard, previousCard, objectId });
  };

  onRender = ({ yAxisSplit, warnings = [] } = {}) => {
    this.setState({ yAxisSplit, warnings });
  };

  onRenderError = error => {
    console.error(error);
    this.setState({ error });
  };

  hideActions = () => {
    if (this.state.clicked !== null) {
      this.setState({ clicked: null });
    }
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      actionButtons,
      className,
      dashcard,
      showTitle,
      isDashboard,
      width,
      height,
      headerIcon,
      errorIcon,
      isSlow,
      isMobile,
      expectedDuration,
      replacementContent,
      onOpenChartSettings,
      onUpdateVisualizationSettings,
      hideWatermark,
    } = this.props;
    const { visualization } = this.state;
    const small = width < 330;
    // these may be overridden below
    let { series, hovered, clicked } = this.state;
    let { style } = this.props;

    const clickActions = this.getClickActions(clicked);
    // disable hover when click action is active
    if (clickActions.length > 0) {
      hovered = null;
    }

    let error = this.props.error || this.state.error;
    let noResults = false;
    let isPlaceholder = false;
    const loading = this.isLoading(series);

    // don't try to load settings unless data is loaded
    let settings = this.props.settings || {};
    if (!loading && !error) {
      settings = this.props.settings || this.state.computedSettings;
      if (!visualization) {
        error = t`Could not find visualization`;
      } else {
        try {
          if (visualization.checkRenderable) {
            visualization.checkRenderable(series, settings, this.props.query);
          }
        } catch (e) {
          error = e.message || t`Could not display this chart with this data.`;
          if (
            e instanceof ChartSettingsError &&
            visualization.placeholderSeries &&
            !isDashboard
          ) {
            // hide the error and replace series with the placeholder series
            error = null;
            series = visualization.placeholderSeries;
            settings = getComputedSettingsForSeries(series);
            isPlaceholder = true;
          } else if (e instanceof ChartSettingsError && onOpenChartSettings) {
            error = (
              <div>
                <div>{error}</div>
                <div className="mt2">
                  <button
                    className="Button Button--primary Button--medium"
                    onClick={() => this.props.onOpenChartSettings(e.initial)}
                  >
                    {e.buttonText}
                  </button>
                </div>
              </div>
            );
          } else if (e instanceof MinRowsError) {
            noResults = true;
          }
        }
      }
    }

    if (!error) {
      noResults = _.every(
        series,
        s => s && s.data && datasetContainsNoResults(s.data),
      );
    }

    const extra = (
      <span className="flex align-center">
        {isSlow && !loading && (
          <VisualizationSlowSpinner
            className="Visualization-slow-spinner"
            size={18}
            isUsuallySlow={isSlow === "usually-slow"}
          />
        )}
        {actionButtons}
      </span>
    );

    let { gridSize, gridUnit, dynamicParams, showDataUpdateTime } = this.props;
    if (
      !gridSize &&
      gridUnit &&
      // Check that width/height are set. If they're not, we want to pass
      // undefined rather than {width: 0, height: 0}. Passing 0 will hide axes.
      width != null &&
      height != null
    ) {
      gridSize = {
        width: Math.round(width / (gridUnit * 4)),
        height: Math.round(height / (gridUnit * 3)),
      };
    }

    if (isPlaceholder) {
      hovered = null;
      style = {
        ...style,
        opacity: 0.2,
        filter: "grayscale()",
        pointerEvents: "none",
      };
    }

    const CardVisualization = visualization;

    const title = settings["card.title"];
    const hasHeaderContent = title || extra;
    const isHeaderEnabled = !(visualization && visualization.noHeader);

    const hasHeader =
      (showTitle &&
        hasHeaderContent &&
        (error || noResults || isHeaderEnabled)) ||
      (replacementContent && (dashcard.size_y !== 1 || isMobile));

    const isEditing = location.hash;
    const isText =
      dashcard?.visualization_settings?.virtual_card?.display === "text";
    const isImage =
      dashcard?.visualization_settings?.virtual_card?.display === "image";
    const isVideo =
      dashcard?.visualization_settings?.virtual_card?.display === "video";
    const isEmbed =
      dashcard?.visualization_settings?.virtual_card?.display === "embed";
    const isTableau =
      dashcard?.visualization_settings?.virtual_card?.display === "tableau";
    const isPublic = location.pathname.startsWith("/public"); // iframe 里面也是 work 的，true
    const isFga = location.pathname.startsWith("/growth");
    const isFgaTwitter = isFga && location.pathname.includes("/Twitter");
    const isFgaDiscord = isFga && location.pathname.includes("/Discord");
    const isFgaGoogleAnalysis =
      isFga && location.pathname.includes("/User%20Funnel");
    const cardId = get(this.props.rawSeries, 0)?.card?.id;

    const renderNoResult = () => {
      if (isFgaDiscord || isFgaTwitter || isFgaGoogleAnalysis) {
        return <FgaErrorGuide />;
      }
      if (isFga) {
        return (
          <div className="noResults">
            The data is not yet available, please
            <br />
            feel free to contact our{" "}
            <Link target="_blank" href="mailto:sales@footprint.network">
              BD team
            </Link>
            .
          </div>
        );
      }
      return (
        <div className="noResults">
          <h4>No results!</h4>
          <ol>
            <li>You can try refreshing your browser.</li>
            <li>You can try changing your filters.</li>
            <li>
              You can try contacting us on{" "}
              <Link
                href="https://discord.gg/3HYaR6USM7"
                rel="nofollow"
                target="_blank"
              >
                Discord
              </Link>
              .
            </li>
          </ol>
        </div>
      );
    };

    return (
      <div
        id="html2canvas-Card"
        className={cx(className, "flex flex-column full-height")}
        style={{ ...style, position: "relative" }}
      >
        {!isPublic && showDataUpdateTime && !isEditing && (
          <div className="Visualization__table-chart-info">
            <Tooltip key="ChartInfo" tooltip={t`Chart Info`}>
              <TableChartInfo
                className=""
                style={{ width: 30 }}
                card={series && series.length > 0 ? series[0]?.card : null}
                dashcard={dashcard}
                tableName={dashcard?.card?.table_name}
                tableId={
                  series && series.length > 0 ? series[0]?.card?.table_id : null
                }
              />
            </Tooltip>
          </div>
        )}
        {!hideWatermark &&
          !isText &&
          !isImage &&
          !isVideo &&
          !isEmbed &&
          !isTableau &&
          !noResults && (
            <div className="waterMarkHome">
              <span />
            </div>
          )}
        {!!hasHeader && (
          <div className="p1 flex-no-shrink">
            <ChartCaption
              series={series}
              settings={settings}
              icon={headerIcon}
              actionButtons={extra}
              onChangeCardAndRun={
                this.props.onChangeCardAndRun && !replacementContent
                  ? this.handleOnChangeCardAndRun
                  : null
              }
            />
          </div>
        )}
        {replacementContent ? (
          replacementContent
        ) : // on dashboards we should show the "No results!" warning if there are no rows or there's a MinRowsError and actualRows === 0
        isDashboard && noResults ? (
          <div
            className={
              "flex-full px1 pb1 text-centered flex flex-column layout-centered " +
              (isDashboard ? "text-slate-light" : "text-slate")
            }
          >
            {/*<Tooltip tooltip={t`No results!`} isEnabled={small}>
              <img data-testid="no-results-image" src={NoResults} />
            </Tooltip>
            {!small && <span className="h4 text-bold">{t`No results!`}</span>}*/}
            {renderNoResult()}
          </div>
        ) : error ? (
          <div
            className={
              "flex-full px1 pb1 text-centered flex flex-column layout-centered " +
              (isDashboard ? "text-slate-light" : "text-slate")
            }
          >
            <>
              {isFgaDiscord || isFgaTwitter || isFgaGoogleAnalysis ? (
                <FgaErrorGuide></FgaErrorGuide>
              ) : (
                <>
                  <Tooltip tooltip={error} isEnabled={small}>
                    <Icon
                      className="mb2"
                      name={errorIcon || "warning"}
                      size={50}
                    />
                  </Tooltip>
                  {
                    <div
                      className="h4 text-bold flex-column"
                      style={{ display: small ? "none" : "" }}
                    >
                      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.2, maxWidth: "80%", margin: "0 auto" }}>{error}</div>
                      {errorIcon !== "key" && <ErrorGuide cardId={cardId} />}
                    </div>
                  }
                </>
              )}
            </>
          </div>
        ) : loading ? (
          <div className="flex-full p1 text-centered text-brand flex flex-column layout-centered">
            {isSlow ? (
              <div className="text-slate">
                <div className="h4 text-bold mb1">{t`Still Waiting...`}</div>
                {isSlow === "usually-slow" ? (
                  <div>
                    {expectedDuration > 0 &&
                      jt`This usually takes an average of ${(
                        <span style={{ whiteSpace: "nowrap" }}>
                          {duration(expectedDuration)}
                        </span>
                      )}.`}
                    <br />
                    {t`(This is a bit long for a dashboard)`}
                  </div>
                ) : (
                  <div>
                    {t`This is usually pretty fast but seems to be taking a while right now.`}
                  </div>
                )}
              </div>
            ) : (
              <LoadingSpinner className="text-slate" />
            )}
          </div>
        ) : (
          <>
            {!this.props.isEditing &&
              isDashboard &&
              ["Discord Members Info", "Twitter Followers Info"].includes(
                this.props.dashcard?.card?.name,
              ) && (
                <div
                  className="flex"
                  style={{
                    position: "absolute",
                    right: 25,
                    top: 10,
                  }}
                >
                  <SocialConnect />
                </div>
              )}
            {this.state.visualization?.identifier === "fgatable" &&
              !this.props.isEditing &&
              isDashboard && (
                <div
                  className="flex"
                  style={{
                    position: "absolute",
                    right: 160,
                    top: 10,
                  }}
                >
                  {get(this.state.computedSettings, "table.create_cohort") && (
                    <CreateCohort style={{ marginLeft: 10 }} />
                  )}
                  {get(
                    this.state.computedSettings,
                    "table.create_filter_cohort",
                  ) && (
                    <CreateFliterCohort
                      state={this.state}
                      propData={this.props}
                      btnText="Create segment"
                      style={{ marginLeft: 10 }}
                    />
                  )}
                  {get(
                    this.state.computedSettings,
                    "table.create_campaign",
                  ) && (
                    <CreateCampaign
                      state={this.state}
                      propData={this.props}
                      style={{ marginLeft: 10 }}
                    />
                  )}
                </div>
              )}
            <CardVisualization
              {...this.props}
              // NOTE: CardVisualization class used to target ExplicitSize HOC
              className="CardVisualization flex-full flex-basis-none"
              isPlaceholder={isPlaceholder}
              series={series}
              settings={settings}
              card={series[0].card} // convenience for single-series visualizations
              data={series[0].data} // convenience for single-series visualizations
              hovered={hovered}
              clicked={clicked}
              headerIcon={hasHeader ? null : headerIcon}
              onHoverChange={this.handleHoverChange}
              onVisualizationClick={this.handleVisualizationClick}
              visualizationIsClickable={this.visualizationIsClickable}
              onRenderError={this.onRenderError}
              onRender={this.onRender}
              onActionDismissal={this.hideActions}
              gridSize={gridSize}
              onChangeCardAndRun={
                this.props.onChangeCardAndRun
                  ? this.handleOnChangeCardAndRun
                  : null
              }
              dynamicParams={dynamicParams}
            />
          </>
        )}
        <ChartTooltip series={series} hovered={hovered} settings={settings} />
        {this.props.onChangeCardAndRun && (
          <ChartClickActions
            clicked={clicked}
            clickActions={clickActions}
            onChangeCardAndRun={this.handleOnChangeCardAndRun}
            onClose={this.hideActions}
            series={series}
            onUpdateVisualizationSettings={onUpdateVisualizationSettings}
          />
        )}
        {location.pathname.startsWith("/guest/chart") && (
          <VisualizationShareFoot location={this.props.location} />
        )}
      </div>
    );
  }
}

export const VisualizationShareFoot = ({ location }) => {
  let user = location?.query?.userSocial;

  if (!user) return null;
  user = JSON.parse(user);

  return (
    <div className="Visualization__share-foot">
      <img
        className="Visualization__share-foot-logo"
        src={getOssUrl("img_nav_logo_v5.svg")}
      />
      {user ? (
        <div className="Visualization__share-foot-user">
          <div className="Visualization__share-foot-user-avatar">
            {user.avatar ? (
              <img
                src={
                  user.avatar + "?x-oss-process=image/resize,m_fill,h_500,w_500"
                }
              />
            ) : (
              <Avatar style={{ backgroundColor: "#E3E3FF" }}>
                <span data-nosnippet>{String(user.name[0]).toUpperCase()}</span>
              </Avatar>
            )}
            <span>{user.name}</span>
          </div>
          <ul className="Visualization__share-foot-user-social">
            {user.twitter && (
              <li>
                <img src={getOssUrl("20220516201254.png")} />
                <span>
                  {user.twitter.startsWith("http")
                    ? user.twitter.replace("https://twitter.com/", "@")
                    : user.twitter.startsWith("@")
                    ? user.twitter
                    : "@" + user.twitter}
                </span>
              </li>
            )}
            {user.telegram && (
              <li>
                <img src={getOssUrl("20220516201327.png")} />
                <span>
                  {user.telegram.startsWith("@")
                    ? user.telegram
                    : "@" + user.telegram}
                </span>
              </li>
            )}
            {user.discord && (
              <li>
                <img src={getOssUrl("20220516201343.png")} />
                <span>
                  {user.discord.startsWith("@")
                    ? user.discord
                    : "@" + user.discord}
                </span>
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => ({
  fontFamily: getFont(state),
});

export default _.compose(
  ExplicitSize({
    selector: ".CardVisualization",
    refreshMode: props => (props.isVisible ? "throttle" : "debounce"),
  }),
  connect(mapStateToProps),
  memoizeClass("_getQuestionForCardCached"),
)(Visualization);
