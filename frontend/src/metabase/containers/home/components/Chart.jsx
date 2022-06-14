/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";

import Visualization from "metabase/visualizations/components/Visualization";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import ExplicitSize from "metabase/components/ExplicitSize";

import type { Card } from "metabase-types/types/Card";
import type { Dataset } from "metabase-types/types/Dataset";
import type { ParameterValues } from "metabase-types/types/Parameter";

import { getParameters, applyParameters } from "metabase/meta/Card";

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

type Props = {
  params: { uuid?: string },
  location: { query: { [key: string]: string } },
  setErrorPage: (error: { status: number }) => void,
  addParamValues: any => void,
  addFields: any => void,
};

type State = {
  card: ?Card,
  result: ?Dataset,
  parameterValues: ParameterValues,
};

const mapStateToProps = state => ({
  metadata: getMetadata(state),
});

const mapDispatchToProps = {
  setErrorPage,
  addParamValues,
  addFields,
};

@connect(mapStateToProps, mapDispatchToProps)
@ExplicitSize()
export default class Chart extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      card: null,
      result: null,
      initialized: false,
      parameterValues: {},
    };
  }

  async componentDidMount() {
    const {
      setErrorPage,
      params: { uuid },
      // location: { query },
    } = this.props;
    console.log("uuid", uuid);
    try {
      let card;
      if (uuid) {
        setPublicQuestionEndpoints(uuid);
        const { data } = await PublicApi.card({ uuid });
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

      const parameterValues: ParameterValues = {};
      // for (const parameter of getParameters(card)) {
      //   parameterValues[String(parameter.id)] = query[parameter.slug];
      // }

      this.setState({ card, parameterValues }, async () => {
        await this.run();
        this.setState({ initialized: true });
      });
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

  run = async (): void => {
    const {
      setErrorPage,
      params: { uuid },
    } = this.props;
    const { card, parameterValues } = this.state;

    if (!card) {
      return;
    }

    const parameters = getParameters(card);

    try {
      this.setState({ result: null });

      let newResult;
      if (uuid) {
        // public links currently apply parameters client-side
        const datasetQuery = applyParameters(card, parameters, parameterValues);
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
    const { card, result, initialized } = this.state;

    return (
      <LoadingAndErrorWrapper
        className="flex-full"
        loading={!result || !initialized}
        error={typeof result === "string" ? result : null}
        noWrapper
      >
        {() => (
          <Visualization
            error={result && result.error}
            rawSeries={[{ card: card, data: result && result.data }]}
            className="full flex-full z1"
            onUpdateVisualizationSettings={settings =>
              this.setState({
                result: updateIn(
                  result,
                  ["card", "visualization_settings"],
                  s => ({ ...s, ...settings }),
                ),
              })
            }
            gridUnit={12}
            showTitle={false}
            isDashboard
            mode={PublicMode}
            metadata={this.props.metadata}
            onChangeCardAndRun={() => {}}
          />
        )}
      </LoadingAndErrorWrapper>
    );
  }
}
