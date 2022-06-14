import React from "react";
import MetabaseUtils from "metabase/lib/utils";

import cx from "classnames";

type Props = {
  className: string,
  legend: string,
  noPadding?: boolean,
  children: React.Element,
};

export default function FieldSet({
  className = "border-brand",
  legend,
  noPadding,
  children,
}: Props) {
  const fieldSetClassName = cx("bordered rounded", { "px2 pb2": !noPadding });

  return (
    <fieldset
      className={`${cx(className, fieldSetClassName)} ${
        MetabaseUtils.isCoin360() ? "FieldSet--coin360" : ""
      }`}
    >
      {legend && (
        <legend
          className="h5 text-bold text-uppercase px1 text-nowrap text-medium"
          style={{
            backgroundColor: MetabaseUtils.isCoin360()
              ? "transparent"
              : "#f9fbfc",
          }}
        >
          {legend}
        </legend>
      )}
      <div className="w-full">{children}</div>
    </fieldset>
  );
}
