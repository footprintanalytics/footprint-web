/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";

import Visualization from "metabase/visualizations/components/Visualization";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import ExplicitSize from "metabase/components/ExplicitSize";
import EmbedFrame from "./components/EmbedFrame";
import title, { updateTitle } from "metabase/hoc/Title";
import {
  getParametersWithExtras,
  applyParameters,
  getParameters,
} from "metabase/meta/Card";

import {
  PublicApi,
  setPublicQuestionEndpoints,
  maybeUsePivotEndpoint,
} from "metabase/services";

import { setErrorPage } from "metabase/redux/app";
import { addParamValues, addFields } from "metabase/redux/metadata";
import { getMetadata } from "metabase/selectors/metadata";
import PublicMode from "metabase/modes/components/modes/PublicMode";
import { updateIn } from "icepick";
import { getUser } from "metabase/selectors/user";
import { b64url_to_utf8 } from "metabase/lib/card";
import querystring from "querystring";
import { dashboardCardSecretData } from "metabase/query_builder/actions";
import { replace } from "react-router-redux";
import { parseTitleId } from "metabase/lib/urls";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";

const mapStateToProps = state => ({
  metadata: getMetadata(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  setErrorPage,
  addParamValues,
  addFields,
  dashboardCardSecretData,
  onReplaceLocation: replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@title(({ card }) => card && card.name)
@ExplicitSize()
@MetaViewportControls
export default class PublicQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null,
      result: null,
      initialized: false,
      parameterValues: {},
      parameters: null,
      parameter_mappings: null,
      secret: "",
    };
    this.uuid =
      props.uuid ||
      props.params.uuid ||
      parseTitleId(props.params.titleAndId).id;
  }

  async UNSAFE_componentWillMount() {
    const { setErrorPage, location } = this.props;

    const uuid = this.uuid;

    if (location.hash) {
      const hash = location.hash.replace(/^#/, "");
      const { key, secret } = querystring.parse(hash);
      let globalDashboardUUid = undefined;
      if (key) {
        const {
          parameters,
          parameterValues,
          parameter_mappings,
          dashboardUuid,
        } = JSON.parse(b64url_to_utf8(key));
        this.state.parameters = parameters;
        this.state.parameterValues = parameterValues;
        this.state.parameter_mappings = parameter_mappings;
        globalDashboardUUid = dashboardUuid;
        this.hasUrlParam = true;
      }
      if (secret) {
        this.state.secret = secret;
        await this.getSecretApi({
          uuid,
          secret: this.state.secret,
          dashboardUuid: globalDashboardUUid,
        });
      }
    }

    if (uuid) {
      setPublicQuestionEndpoints(uuid);
    }

    try {
      let card;
      if (uuid) {
        const { data } = await PublicApi.card({
          uuid,
          secret: this.state.secret,
        });
        card = data;
      } else {
        throw { status: 404 };
      }

      if (card.param_values) {
        this.props.addParamValues(card.param_values);
      }
      if (card.param_fields) {
        this.props.addFields(card.param_fields);
      }
      this.setState({ card }, async () => {
        await this.run();
        this.setState({ initialized: true });
        updateTitle(card.name);
      });
    } catch (error) {
      console.error("error", error);
      setErrorPage(error);
    }
  }

  canUserReplace = () => {
    const { location } = this.props;
    return (
      location &&
      location.pathname &&
      location.pathname.startsWith("/guest/question")
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user && this.canUserReplace()) {
      const { user } = nextProps;
      const { card } = this.state;
      if (
        (user && card && card.creator && user.id === card.creator.id) ||
        user.is_superuser
      ) {
        this.props.onReplaceLocation(`/question/${card.id}`);
      }
    }
  }

  getSecretApi = async ({ uuid, secret, dashboardUuid }) => {
    if (dashboardUuid) {
      const { payload } = await this.props.dashboardCardSecretData({
        uuid: dashboardUuid,
        cardUuid: uuid,
        secret,
      });
      if (payload?.secret) {
        this.setState({
          secret: payload.secret,
        });
      }
    }
  };

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

  setMultipleParameterValues = parameterValues => {
    this.setState(
      {
        parameterValues: {
          ...this.state.parameterValues,
          ...parameterValues,
        },
      },
      this.run,
    );
  };

  run = async () => {
    const { setErrorPage } = this.props;

    const uuid = this.uuid;

    const { card, parameterValues, parameter_mappings } = this.state;
    let parameters = this.state.parameters;

    if (!card) {
      return;
    }

    if (!this.hasUrlParam) {
      parameters = getParameters(card);
    }

    try {
      this.setState({ result: null });

      let newResult;
      if (uuid) {
        // public links currently apply parameters client-side
        const datasetQuery = applyParameters(
          card,
          parameters,
          parameterValues,
          parameter_mappings,
        );
        newResult = await maybeUsePivotEndpoint(
          PublicApi.cardQuery,
          card,
        )({
          uuid,
          parameters: JSON.stringify(datasetQuery.parameters),
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
    const { user, location } = this.props;

    const uuid = this.uuid;

    const { card, result, initialized, parameterValues } = this.state;

    const parameters = card && getParametersWithExtras(card);

    const creatorId =
      card && (card.creator_id || (card.creator && card.creator.id));

    const showEditButton = user && (user.id === creatorId || user.is_superuser);

    return (
      <EmbedFrame
        className="w-full"
        type="card"
        uuid={uuid}
        name={card && card.name}
        entityId={card && card.id}
        creatorId={card && card.creator_id}
        description={card && card.description}
        parameters={initialized ? parameters : []}
        parameterValues={parameterValues}
        setParameterValue={this.setParameterValue}
        setMultipleParameterValues={this.setMultipleParameterValues}
        user={user}
        creator={card && card.creator}
        statistics={card && card.statistics}
        createdAt={card && card.createdAt}
        isFavorite={card && card.isFavorite}
        showEditButton={showEditButton}
        result={result}
        card={card}
      >
        <LoadingAndErrorWrapper
          className="flex-full"
          loading={!result || !initialized}
          error={typeof result === "string" ? result : null}
          noWrapper
        >
          {() => (
            <Visualization
              location={location}
              error={result && result.error}
              rawSeries={[{ card: card, data: result && result.data }]}
              className="full flex-full z1 py2"
              onUpdateVisualizationSettings={settings =>
                this.setState({
                  result: updateIn(
                    result,
                    ["card", "visualization_settings"],
                    s => ({ ...s, ...settings }),
                  ),
                })
              }
              hideWatermark={card && card.hideWatermark}
              gridUnit={12}
              showTitle={false}
              mode={PublicMode}
              metadata={this.props.metadata}
              onChangeCardAndRun={() => {}}
              showDataUpdateTime={true}
            />
          )}
        </LoadingAndErrorWrapper>
      </EmbedFrame>
    );
  }
}
