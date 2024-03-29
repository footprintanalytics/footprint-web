/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";

import { updateIn } from "icepick";
import Visualization from "metabase/visualizations/components/Visualization";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import ExplicitSize from "metabase/components/ExplicitSize";
import title from "metabase/hoc/Title";
import { isFgaPath } from "metabase/growth/utils/utils";
import { isABPath } from "metabase/ab/utils/utils";

import { getParameterValuesByIdFromQueryParams } from "metabase/parameters/utils/parameter-values";

import {
  PublicApi,
  EmbedApi,
  setPublicQuestionEndpoints,
  setEmbedQuestionEndpoints,
  maybeUsePivotEndpoint,
} from "metabase/services";

import { setErrorPage } from "metabase/redux/app";
import { addParamValues, addFields } from "metabase/redux/metadata";
import { getMetadata } from "metabase/selectors/metadata";

import PublicMode from "metabase/modes/components/modes/PublicMode";
import { getCardUiParameters } from "metabase-lib/parameters/utils/cards";
import { getParameterValuesBySlug } from "metabase-lib/parameters/utils/parameter-values";
import { getParametersFromCard } from "metabase-lib/parameters/utils/template-tags";
import { applyParameters } from "metabase-lib/queries/utils/card";
import EmbedFrame from "../components/EmbedFrame";
import { parseTitleId } from "metabase/lib/urls";
import { parseHashOptions } from "metabase/lib/browser";
import { Breadcrumb } from "antd";
import cx from "classnames";
import { canShowDarkMode } from "metabase/dashboard/components/utils/dark";
import { get, has } from "lodash";
import Link from "metabase/core/components/Link/Link";

const mapStateToProps = state => ({
  metadata: getMetadata(state),
});

const mapDispatchToProps = {
  setErrorPage,
  addParamValues,
  addFields,
};

class PublicQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null,
      result: null,
      initialized: false,
      parameterValues: {},
    };
  }

  async UNSAFE_componentWillMount() {
    const {
      setErrorPage,
      params: { uuid, token, titleAndId },
      location: { query },
    } = this.props;
    const publicUuid = uuid || parseTitleId(titleAndId).id;
    if (publicUuid) {
      setPublicQuestionEndpoints(publicUuid);
    } else if (token) {
      setEmbedQuestionEndpoints(token);
    }

    try {
      let card;
      if (token) {
        card = await EmbedApi.card({ token });
      } else if (publicUuid) {
        const { data } = await PublicApi.card({ uuid: publicUuid });
        card = data;
      } else {
        throw { status: 404 };
      }
      if (card.param_values) {
        await this.props.addParamValues(card.param_values);
      }
      if (card.param_fields) {
        await this.props.addFields(card.param_fields);
      }

      const parameters = getCardUiParameters(
        card,
        this.props.metadata,
        {},
        card.parameters || undefined,
      );
      const parameterValuesById = getParameterValuesByIdFromQueryParams(
        parameters,
        query,
        this.props.metadata,
      );
      this.setState(
        { card, parameterValues: parameterValuesById },
        async () => {
          await this.run();
          this.setState({ initialized: true });
        },
      );
    } catch (error) {
      console.error("error", error);
      setErrorPage(error);
    }
  }

  setParameterValue = (parameterId, value) => {
    this.setState(
      {
        parameterValues: {
          ...this.state.parameterValues,
          [parameterId]: value,
        },
      },
      this.run,
    );
  };

  getCacheOption() {
    const { location } = this.props;
    const ignoreCache = get(location?.query, "ignore_cache");
    if (
      has(location?.query, "ignore_cache") &&
      (!ignoreCache || ignoreCache === "true")
    ) {
      return { ignore_cache: true };
    }
    return null;
  }

  run = async () => {
    const {
      setErrorPage,
      params: { uuid, token, titleAndId },
    } = this.props;
    const { card, parameterValues } = this.state;
    const publicUuid = uuid || parseTitleId(titleAndId).id;
    if (!card) {
      return;
    }

    const parameters = card.parameters || getParametersFromCard(card);

    try {
      this.setState({ result: null });

      let newResult;
      if (token) {
        // embeds apply parameter values server-side
        newResult = await maybeUsePivotEndpoint(
          EmbedApi.cardQuery,
          card,
        )({
          token,
          ...getParameterValuesBySlug(parameters, parameterValues),
        });
      } else if (publicUuid) {
        // public links currently apply parameters client-side
        const datasetQuery = applyParameters(card, parameters, parameterValues);
        newResult = await maybeUsePivotEndpoint(
          PublicApi.cardQuery,
          card,
        )({
          uuid: publicUuid,
          parameters: JSON.stringify(datasetQuery.parameters),
          ...this.getCacheOption(),
        });
      } else {
        throw { status: 404 };
      }

      this.setState({ result: newResult });
    } catch (error) {
      console.error("error", error);
      setErrorPage(error);
    }
  };

  render() {
    const {
      // params: { uuid, token, titleAndId },
      metadata,
      router,
      className,
      hideFooter,
      isNightMode,
    } = this.props;
    const { card, result, initialized, parameterValues } = this.state;
    // const publicUuid = uuid || parseTitleId(titleAndId).id;

    /*    const actionButtons = result && (
      <QueryDownloadWidgetFP
        className="m1 text-medium-hover"
        uuid={publicUuid}
        token={token}
        result={result}
      />
    );*/

    const parameters =
      card &&
      getCardUiParameters(card, metadata, {}, card.parameters || undefined);
    const isFgaPublicDashboard = isFgaPath();
    const isABPublicDashboard = isABPath();
    const hashData = parseHashOptions(location?.hash);
    let header = <></>;
    let hideTitle = false;
    if ((isFgaPublicDashboard || isABPublicDashboard) && hashData?.from && card) {
      header = (
        <>
          <Breadcrumb
            className="pl1 py2"
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
                title: card && card.name,
              },
            ]}
          />
          {header}
        </>
      );
      hideTitle = true;
    }
    const shouldRenderAsNightMode = isNightMode || canShowDarkMode();
    const showAPITip = this.props.showAPITip;
    return (
      <EmbedFrame
        name={card && card.name}
        description={card && card.description}
        // actionButtons={actionButtons}
        parameters={initialized ? parameters : []}
        headerLayout={header}
        parameterValues={parameterValues}
        hideTitle={hideTitle || hashData?.hide_title}
        isNightMode={shouldRenderAsNightMode}
        className={cx(
          className,
          `${(isFgaPublicDashboard || isABPublicDashboard) ? "ml-250 mt-60" : ""}`,
        )}
        hideFooter={hideFooter || (isFgaPublicDashboard || isABPublicDashboard)}
        setParameterValue={this.setParameterValue}
      >
        <LoadingAndErrorWrapper
          className="flex-full"
          loading={!result || !initialized}
          error={typeof result === "string" ? result : null}
          noWrapper
        >
          {() => (
            <>
            <Visualization
              error={result && result.error}
              rawSeries={[{ card: card, data: result && result.data }]}
              className="full flex-full z1"
              onUpdateVisualizationSettings={settings => {
                this.setState({
                  result: updateIn(
                    result,
                    ["card", "visualization_settings"],
                    s => ({ ...s, ...settings }),
                  ),
                });
              }}
              gridUnit={12}
              showTitle={false}
              isDashboard
              mode={PublicMode}
              metadata={this.props.metadata}
              onChangeCardAndRun={() => {}}
              hideWatermark={card?.hideWatermark}
            />
            {showAPITip && (
              <div className={"flex justify-end pr2 pb3 pt2"}>
                <div className="text-white" style={{fontSize: 18}}>Get this data with {" "}
                  <Link to={"https://docs.footprint.network"} className={"text-underline text-underline-hover"} target={"_blank"} style={{fontSize: 20, color: "#6C70FF"}}>
                    Footprint Analytics API
                  </Link>
                </div>
              </div>
            )}
            </>

          )}
        </LoadingAndErrorWrapper>
      </EmbedFrame>
    );
  }
}

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  title(
    ({ disableUpdateTitle, card }) => !disableUpdateTitle && card && card.name,
  ),
  ExplicitSize({ refreshMode: "debounceLeading" }),
)(PublicQuestion);
