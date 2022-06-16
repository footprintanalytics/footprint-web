/* eslint-disable curly */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React from "react";

import ExplicitSize from "metabase/components/ExplicitSize";
import ChartCaption from "metabase/visualizations/components/ChartCaption";
import ChartTooltip from "metabase/visualizations/components/ChartTooltip";
import ChartClickActions from "metabase/visualizations/components/ChartClickActions";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import { t, jt } from "ttag";
import { duration, formatNumber } from "metabase/lib/formatting";
import * as MetabaseAnalytics from "metabase/lib/analytics";

import {
  getVisualizationTransformed,
  extractRemappings,
} from "metabase/visualizations";
import { getComputedSettingsForSeries } from "metabase/visualizations/lib/settings/visualization";
import { isSameSeries } from "metabase/visualizations/lib/utils";
import { performDefaultAction } from "metabase/visualizations/lib/action";

import Utils from "metabase/lib/utils";
import { datasetContainsNoResults } from "metabase/lib/dataset";

import {
  MinRowsError,
  ChartSettingsError,
} from "metabase/visualizations/lib/errors";

import NoResults from "assets/img/no_results.svg";

import { assoc } from "icepick";
import _ from "underscore";
import cx from "classnames";

export const ERROR_MESSAGE_GENERIC = t`There was a problem displaying this chart.`;
export const ERROR_MESSAGE_PERMISSION = t`Sorry, you don't have permission to see this card.`;

import Question from "metabase-lib/lib/Question";
import Query from "metabase-lib/lib/queries/Query";
import Mode from "metabase-lib/lib/Mode";
import type {
  Card as CardObject,
  VisualizationSettings,
} from "metabase-types/types/Card";
import type {
  HoverObject,
  ClickObject,
  Series,
  RawSeries,
  OnChangeCardAndRun,
} from "metabase-types/types/Visualization";
import Metadata from "metabase-lib/lib/metadata/Metadata";
import { memoize } from "metabase-lib/lib/utils";
import { connect } from "react-redux";
import DataUpdateTime from "metabase/components/DataUpdateTime";
import "./Visualization.css";
import { isDefi360 } from "metabase/lib/project_info";
import { getOssUrl } from "metabase/lib/image";
import { Avatar } from "antd";
import ErrorGuide from "metabase/query_builder/components/ErrorGuide";

type Props = {
  rawSeries: RawSeries,

  className: string,
  style: { [key: string]: any },

  showTitle: boolean,
  isDashboard: boolean,
  isEditing: boolean,
  isSettings: boolean,
  clickable: boolean,
  hideWatermark: boolean,
  chartStyle: string,
  isQueryBuilder: boolean,

  headerIcon?: {
    name: string,
    color?: string,
    size?: Number,
    tooltip?: string,
  },

  actionButtons: React.Element<any>,

  // errors
  error: string,
  errorIcon: string,

  // slow card warnings
  isSlow: boolean,
  expectedDuration: number,

  // injected by ExplicitSize
  width: number,
  height: number,

  // settings overrides from settings panel
  settings: VisualizationSettings,

  // for click actions
  metadata: Metadata,
  dispatch: Function,
  onChangeCardAndRun: OnChangeCardAndRun,
  onChangeLocation: (url: string) => void,

  // for checking renderability
  query: Query,

  mode?: Mode,

  // used for showing content in place of visualization, e.x. dashcard filter mapping
  replacementContent: React.Element<any>,

  // misc
  onUpdateWarnings: (string[]) => void,
  onOpenChartSettings: ({ section?: ?string, widget?: ?any }) => void,
  onUpdateVisualizationSettings: (settings: { [key: string]: any }) => void,

  // number of grid cells wide and tall
  gridSize?: { width: number, height: number },
  // if gridSize isn't specified, compute using this gridSize (4x width, 3x height)
  gridUnit?: number,

  classNameWidgets?: string,

  getExtraDataForClick?: Function,
};

type State = {
  series: ?Series,
  visualization: ?(React.Component<void, VisualizationSettings, void> & {
    checkRenderable: (any, any, any) => void,
    noHeader: boolean,
  }),
  computedSettings: VisualizationSettings,

  hovered: ?HoverObject,
  clicked: ?ClickObject,

  error: ?Error,
  warnings: string[],
  yAxisSplit: ?(number[][]),
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

// NOTE: pass `CardVisualization` so that we don't include header when providing size to child element
@ExplicitSize({ selector: ".CardVisualization" })
@connect(mapStateToProps)
export default class Visualization extends React.PureComponent {
  state: State;
  props: Props;

  _resetHoverTimer: ?number;

  constructor(props: Props) {
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
    clickable: false,
    hideWatermark: false,
    isQueryBuilder: false,
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
      !Utils.equals(newProps.settings, this.props.settings)
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

  componentWillUnmount() {
    this.setState = () => false;
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
      clicked: null,
      error: null,
      warnings: [],
      yAxisSplit: null,
      series: series,
      visualization: visualization,
      computedSettings: computedSettings,
    });
  }

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

  @memoize
  _getQuestionForCardCached(metadata, card) {
    return metadata && card && new Question(card, metadata);
  }

  getClickActions(clicked: ?ClickObject) {
    if (!clicked) {
      return [];
    }
    const { metadata, getExtraDataForClick = () => ({}) } = this.props;
    // TODO: push this logic into Question?
    const seriesIndex = clicked.seriesIndex || 0;
    const card = this.state.series[seriesIndex].card;
    const question = this._getQuestionForCardCached(metadata, card);
    const mode = this.props.mode
      ? question && new Mode(question, this.props.mode)
      : question && question.mode();

    return mode
      ? mode.actionsForClick(
          { ...clicked, extraData: getExtraDataForClick(clicked) },
          {},
        )
      : [];
  }

  visualizationIsClickable = (clicked: ClickObject) => {
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

  handleVisualizationClick = (clicked: ClickObject) => {
    if (!this.props.clickable) {
      return;
    }
    if (clicked) {
      MetabaseAnalytics.trackStructEvent(
        "Actions",
        "Clicked",
        `${clicked.column ? "column" : ""} ${clicked.value ? "value" : ""} ${
          clicked.dimensions ? "dimensions=" + clicked.dimensions.length : ""
        }`,
      );
    }

    if (
      performDefaultAction(this.getClickActions(clicked), {
        dispatch: this.props.dispatch,
        onChangeCardAndRun: this.handleOnChangeCardAndRun,
      })
    ) {
      return;
    }

    // needs to be delayed so we don't clear it when switching from one drill through to another
    setTimeout(() => {
      this.setState({ clicked });
    }, 100);
  };

  // Add the underlying card of current series to onChangeCardAndRun if available
  handleOnChangeCardAndRun = ({
    nextCard,
    seriesIndex,
    unAuth,
  }: {
    nextCard: CardObject,
    seriesIndex: number,
    unAuth: boolean,
  }) => {
    const { series, clicked } = this.state;

    const index = seriesIndex || (clicked && clicked.seriesIndex) || 0;
    const previousCard: ?CardObject =
      series && series[index] && series[index].card;

    this.props.onChangeCardAndRun({ nextCard, previousCard, unAuth });
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
      showTitle,
      isDashboard,
      width,
      height,
      headerIcon,
      errorIcon,
      isSlow,
      hideWatermark,
      expectedDuration,
      replacementContent,
      onOpenChartSettings,
      dashcard,
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
    const loading = !(
      series &&
      series.length > 0 &&
      _.every(
        series,
        s => s.data || _.isObject(s.card.visualization_settings.virtual_card),
      )
    );
    let noResults = false;
    let isPlaceholder = false;

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
          <LoadingSpinner
            size={18}
            className={cx(
              "Visualization-slow-spinner",
              isSlow === "usually-slow" ? "text-gold" : "text-slate",
            )}
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

    const isEditing = location.hash;
    const title = settings["card.title"];
    const hasHeaderContent = title || extra;
    const isHeaderEnabled = !(visualization && visualization.noHeader);

    const hasHeader =
      (showTitle &&
        hasHeaderContent &&
        (error || noResults || isHeaderEnabled)) ||
      replacementContent;

    const isText =
      dashcard?.visualization_settings?.virtual_card?.display === "text";
    const isImage =
      dashcard?.visualization_settings?.virtual_card?.display === "image";
    const isVideo =
      dashcard?.visualization_settings?.virtual_card?.display === "video";

    return (
      <div
        id="html2canvas-Card"
        className={cx(className, "flex flex-column full-height")}
        style={{ ...style, position: "relative" }}
      >
        {showDataUpdateTime && !isEditing && !Utils.isCoin360() && (
          <DataUpdateTime />
        )}
        {/* {!hideWatermark && !isDefi360() && <div className="waterMarkHome" />} */}
        {!hideWatermark &&
          !isDefi360() &&
          !isText &&
          !isImage &&
          !isVideo &&
          !noResults && (
            <div className="waterMarkHome">
              <span
                style={{
                  filter: Utils.isCoin360() ? "brightness(0) invert(1)" : "",
                }}
              />
            </div>
          )}
        {/*{!isText && <div className="waterMarkHome" />}*/}
        {!!hasHeader && (
          <ChartCaption
            series={series}
            settings={settings}
            icon={headerIcon}
            actionButtons={extra}
            onChangeCardAndRun={arg => {
              this.props.onChangeCardAndRun && !replacementContent
                ? this.handleOnChangeCardAndRun({ ...arg, unAuth: true })
                : null;
            }}
            dashcard={dashcard}
          />
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
            <div style={{ display: "none" }}>
              <Tooltip tooltip={t`No results!`} isEnabled={small}>
                <img src={NoResults} />
              </Tooltip>
              {
                <span
                  className="h4 text-bold"
                  style={{ display: small ? "none" : "" }}
                >
                  No results!
                </span>
              }
            </div>
            <div className="noResults">
              <h4>No results!</h4>
              <ol>
                <li>You can try refreshing your browser.</li>
                <li>You can try changing your filters.</li>
                <li>
                  You can try contacting us on{" "}
                  <a
                    href="https://discord.gg/3HYaR6USM7"
                    rel="nofollow"
                    target="_blank"
                  >
                    Discord
                  </a>
                  .
                </li>
              </ol>
            </div>
          </div>
        ) : error ? (
          <div
            className={
              "flex-full px1 pb1 text-centered flex flex-column layout-centered " +
              (isDashboard ? "text-slate-light" : "text-slate")
            }
          >
            <Tooltip tooltip={error} isEnabled={small}>
              <Icon className="mb2" name={errorIcon || "warning"} size={50} />
            </Tooltip>
            {
              <div
                className="h4 text-bold flex-column"
                style={{ display: small ? "none" : "" }}
              >
                <div>{error}</div>
                <ErrorGuide />
              </div>
            }
          </div>
        ) : loading ? (
          <div className="flex-full p1 text-centered text-brand flex flex-column layout-centered">
            {isSlow ? (
              <div className="text-slate">
                <div className="h4 text-bold mb1">{t`Still Waiting...`}</div>
                {isSlow === "usually-slow" ? (
                  <div>
                    {expectedDuration > 0 && jt`This usually takes an average of ${(
                      <span
                        key="expectedDuration"
                        style={{ whiteSpace: "nowrap" }}
                      >
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
          <CardVisualization
            {...this.props}
            // NOTE: CardVisualization class used to target ExplicitSize HOC
            className="CardVisualization flex-full flex-basis-none"
            series={series}
            settings={settings}
            card={series[0].card} // convenience for single-series visualizations
            data={series[0].data} // convenience for single-series visualizations
            hovered={hovered}
            headerIcon={hasHeader ? null : headerIcon}
            onHoverChange={this.handleHoverChange}
            onVisualizationClick={this.handleVisualizationClick}
            visualizationIsClickable={this.visualizationIsClickable}
            onRenderError={this.onRenderError}
            onRender={this.onRender}
            onActionDismissal={this.hideActions}
            gridSize={gridSize}
            dynamicParams={dynamicParams}
            onChangeCardAndRun={
              this.props.onChangeCardAndRun
                ? this.handleOnChangeCardAndRun
                : null
            }
          />
        )}
        <ChartTooltip series={series} hovered={hovered} settings={settings} />
        {this.props.onChangeCardAndRun && (
          <ChartClickActions
            clicked={clicked}
            clickActions={clickActions}
            onChangeCardAndRun={this.handleOnChangeCardAndRun}
            onClose={this.hideActions}
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
