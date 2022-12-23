import React, { useState } from "react";
import { t } from "ttag";

import AutocompleteInput from "metabase/core/components/AutocompleteInput";
import { Channel, ChannelSpec } from "metabase-types/api";


interface FootprintChannelFieldProps {
  channel: Channel;
  channelSpec: ChannelSpec;
  fieldName: string;
  placeholder: string;
  onChannelPropertyChange: any;
}

const FootprintChannelField = ({
  channel,
  channelSpec,
  fieldName,
  placeholder,
  onChannelPropertyChange,
}: FootprintChannelFieldProps) => {
  const [hasPrivateChannelWarning, setHasPrivateChannelWarning] =
    useState(false);

  const channelField = channelSpec.fields.find(
    field => field.name === fieldName,
  );
  // @ts-ignore
  const value = channel?.recipients?.[0]?.[fieldName] ?? "";

  const updateChannel = (value: string) => {
    onChannelPropertyChange("recipients", [{
      ...(channel?.recipients?.[0] || {}),
      [fieldName]: value,
    }]);
  }

  const handleChange = (value: string) => {
    updateChannel(value);
    setHasPrivateChannelWarning(false);
  };

  const handleBlur = () => {

    const isEmpty = value.trim().length === 0;

    setHasPrivateChannelWarning(isEmpty);
  };

  return (
    <div>
      <span className="block text-bold pb2">{channelField?.displayName}</span>
      <AutocompleteInput
        placeholder={placeholder}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {hasPrivateChannelWarning && (
        <div className="mt1">{t`Not allowed to be empty.`}</div>
      )}
    </div>
  );
};

export default FootprintChannelField;
