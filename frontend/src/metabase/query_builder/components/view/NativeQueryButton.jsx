/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import _ from "underscore";

import Tooltip from "metabase/components/Tooltip";
import Modal from "metabase/components/Modal";
import Button from "metabase/components/Button";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

import { formatNativeQuery, getEngineNativeType } from "metabase/lib/engine";

import { MetabaseApi } from "metabase/services";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { trackStructEvent } from "metabase/lib/analytics";
import withToast from "metabase/hoc/Toast";
import CopyToClipboard from "react-copy-to-clipboard";

const STRINGS = {
  "": {
    tooltip: t`View the SQL query`,
    title: t`SQL query for this chart`,
    button: t`Convert this chart to a SQL query`,
  },
  sql: {
    tooltip: t`View the SQL`,
    title: t`SQL for this chart`,
    button: t`Convert this chart to SQL`,
  },
};

export default class NativeQueryButton extends React.Component {
  state = {
    open: false,
    loading: false,
    native: null,
    datasetQuery: null,
    showVip: false,
  };

  handleOpen = async () => {
    trackStructEvent(`click NativeQuery edit chart`);
    const { question, canNativeQuery } = this.props;
    if (!canNativeQuery) {
      this.setState({ showVip: true });
      return;
    }
    const datasetQuery = question.datasetQuery();
    this.setState({ open: true });
    if (!_.isEqual(datasetQuery, this.state.datasetQuery)) {
      this.setState({ loading: true, error: null });
      try {
        const native = await MetabaseApi.native(datasetQuery);
        this.setState({ loading: false, native, datasetQuery });
      } catch (error) {
        console.error(error);
        this.setState({ loading: false, error });
      }
    }
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleConvert = () => {
    this.props.question
      .setDatasetQuery({
        type: "native",
        native: { query: this.getFormattedQuery() },
        database: this.state.datasetQuery.database,
      })
      .update(null, { shouldUpdateUrl: true });
  };

  getFormattedQuery() {
    const { question } = this.props;
    const { native } = this.state;
    return formatNativeQuery(
      native && native.query,
      question.database().engine,
    );
  }

  render() {
    const { question, btnString } = this.props;
    const { loading, error, native } = this.state;

    const sql = native && native.query;

    const engineType = getEngineNativeType(question.database().engine);
    const { tooltip, title, button } =
      STRINGS[engineType] || Object.values(STRINGS)[0];

    return (
      <div>
        <Tooltip tooltip={tooltip}>
          <Button
            // onlyIcon
            className={`${btnString ? "" : "Question-header-btn"}`}
            iconColor="#7A819B"
            icon="cmd"
            iconSize={16}
            onClick={this.handleOpen}
            {...this.props}
          >
            {btnString}
          </Button>
        </Tooltip>
        <Modal
          isOpen={this.state.open}
          title={title}
          footer={
            loading || error ? null : (
              <div className="flex flex-row">
                {sql && (
                  <CopySql text={sql}>
                    <Button className="mr1">Copy original SQL</Button>
                  </CopySql>
                )}

                <Button primary onClick={this.handleConvert}>
                  {button}
                </Button>
              </div>
            )
          }
          onClose={this.handleClose}
        >
          <LoadingAndErrorWrapper loading={loading} error={error}>
            <pre className="mb3 p2 sql-code">{this.getFormattedQuery()}</pre>
          </LoadingAndErrorWrapper>
        </Modal>
        {this.state.showVip && (
          <NeedPermissionModal
            title="Upgrade your account to access SQL query"
            onClose={() => this.setState({ showVip: false })}
            afterChangeLocation={() => {
              this.setState({ showVip: false });
            }}
          />
        )}
      </div>
    );
  }
}

const CopySql = withToast(({ text, children, triggerToast }) => (
  <CopyToClipboard
    text={text}
    onCopy={() => triggerToast(`Copied to clipboard`)}
  >
    <span className="cursor-pointer">{children}</span>
  </CopyToClipboard>
));

NativeQueryButton.shouldRender = ({ question, queryBuilderMode }) =>
  // queryBuilderMode === "notebook" &&
  question.isStructured() && question.database();
// question.database().native_permissions === "write";
