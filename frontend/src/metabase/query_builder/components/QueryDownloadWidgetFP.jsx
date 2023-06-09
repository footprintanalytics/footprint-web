/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { t } from "ttag";
import { parse as urlParse } from "url";
import querystring from "querystring";
import cx from "classnames";
import Button from "metabase/core/components/Button";


import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import DownloadButtonFP from "metabase/components/DownloadButtonFP";
import Tooltip from "metabase/components/Tooltip";

import * as Urls from "metabase/lib/urls";


const EXPORT_FORMATS = Urls.exportFormats;

const QueryDownloadWidgetFP = ({
  className,
  classNameClose,
  card,
  result,
  uuid,
  token,
  dashcardId,
  icon,
  iconColor = "#7A819B",
  params,
  visualizationSettings,
  buttonClassName="Question-header-btn",
}) => (
  <PopoverWithTrigger
    triggerElement={
      <Tooltip tooltip={t`Download full results`}>
        <Button
          onlyIcon
          className={cx(buttonClassName)}
          iconColor={iconColor}
          icon={icon}
          iconSize={16}
        />
      </Tooltip>
    }
    triggerClasses={cx(className, "text-brand-hover")}
    triggerClassesClose={classNameClose}
  >
    <div
      className="p2"
      style={{
        width: result.data && result.data.rows_truncated != null ? 300 : 260
      }}
    >
      <div className="p1">
        <h4>{t`Download full results`}</h4>
      </div>
      {result.data != null && result.data.rows_truncated != null && (
        <div className="px1">
          <p>{t`Your answer has a large number of rows so it could take a while to download.`}</p>
          <p>{t`The maximum download size is 1 million rows.`}</p>
        </div>
      )}
      <div>
        {EXPORT_FORMATS.map(type => (
          <div key={type} style={{ width: "100%" }}>
            {dashcardId && token ? (
              <DashboardEmbedQueryButton
                key={type}
                type={type}
                dashcardId={dashcardId}
                token={token}
                card={card}
                params={params}
              />
            ) : uuid ? (
              <PublicQueryButton
                key={type}
                type={type}
                uuid={uuid}
                result={result}
              />
            ) : token ? (
              <EmbedQueryButton key={type} type={type} token={token} />
            ) : card && card.id ? (
              <SavedQueryButton
                key={type}
                type={type}
                card={card}
                result={result}
              />
            ) : card && !card.id ? (
              <UnsavedQueryButton
                key={type}
                type={type}
                result={result}
                visualizationSettings={visualizationSettings}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  </PopoverWithTrigger>
);

const UnsavedQueryButton = ({
  type,
  result: { json_query = {} },
  visualizationSettings,
}) => (
  <DownloadButtonFP
    mode="unsaved"
    params={{
      query: JSON.stringify(_.omit(json_query, "constraints")),
      visualization_settings: JSON.stringify(visualizationSettings),
      type,
    }}
    extensions={[type]}
  >
    {type}
  </DownloadButtonFP>
);

const SavedQueryButton = ({ type, result: { json_query = {} }, card }) => (
  <DownloadButtonFP
    mode="saved"
    params={{
      parameters: JSON.stringify(json_query.parameters),
      type,
      cardId: card.id,
    }}
    extensions={[type]}
  >
    {type}
  </DownloadButtonFP>
);

const PublicQueryButton = ({ type, uuid, result: { json_query = {} } }) => (
  <DownloadButtonFP
    method="GET"
    url={Urls.publicQuestion({ uuid, options: type })}
    params={{ parameters: JSON.stringify(json_query.parameters) }}
    extensions={[type]}
  >
    {type}
  </DownloadButtonFP>
);

const EmbedQueryButton = ({ type, token }) => {
  // Parse the query string part of the URL (e.g. the `?key=value` part) into an object. We need to pass them this
  // way to the `DownloadButtonFP` because it's a form which means we need to insert a hidden `<input>` for each param
  // we want to pass along. For whatever wacky reason the /api/embed endpoint expect params like ?key=value instead
  // of like ?params=<json-encoded-params-array> like the other endpoints do.
  const query = urlParse(window.location.href).query; // get the part of the URL that looks like key=value
  const params = query && querystring.parse(query); // expand them out into a map

  return (
    <DownloadButtonFP
      method="GET"
      url={Urls.embedCard(token, type)}
      params={params}
      extensions={[type]}
    >
      {type}
    </DownloadButtonFP>
  );
};

const DashboardEmbedQueryButton = ({
  type,
  dashcardId,
  token,
  card,
  params,
}) => (
  <DownloadButtonFP
    method="GET"
    url={`api/embed/dashboard/${token}/dashcard/${dashcardId}/card/${card.id}/${type}`}
    extensions={[type]}
    params={params}
  >
    {type}
  </DownloadButtonFP>
);

QueryDownloadWidgetFP.propTypes = {
  card: PropTypes.object,
  result: PropTypes.object,
  uuid: PropTypes.string,
  icon: PropTypes.string,
  params: PropTypes.object,
};

QueryDownloadWidgetFP.defaultProps = {
  result: {},
  icon: "download",
  params: {},
};

QueryDownloadWidgetFP.shouldRender = ({ result, isResultDirty }) =>
  !isResultDirty && result && !result.error;

export default QueryDownloadWidgetFP;
