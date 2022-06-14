import React from "react";
import cx from "classnames";

import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import { formatTitle } from "metabase/lib/formatting";

type Attributes = {
  title: string,
  description?: string,
  className?: string,
};
const TitleAndDescription = ({ title, description, className }: Attributes) => (
  <div className={cx("flex align-center", className)}>
    <h2 className="footprint-title1 text-pre-wrap ">{formatTitle(title)}</h2>
    {description && (
      <Tooltip tooltip={description} maxWidth={"22em"}>
        <Icon name="info" className="mx1" />
      </Tooltip>
    )}
  </div>
);

export default React.memo(TitleAndDescription);
