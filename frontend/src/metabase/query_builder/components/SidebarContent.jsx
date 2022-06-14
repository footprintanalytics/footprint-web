/* eslint-disable react/prop-types */
import React from "react";

import ViewButton from "./view/ViewButton";
import SidebarHeader from "./SidebarHeader";

import cx from "classnames";
import { t } from "ttag";
import SidebarCategory from "metabase/query_builder/components/SidebarCategory";

export default function SidebarContent({
  className,
  icon,
  title,
  color,
  onBack,
  onClose,
  onDone,
  doneButtonText = t`Done`,
  footer = onDone ? (
    <FooterButton color={color} onClick={onDone}>
      {doneButtonText}
    </FooterButton>
  ) : null,
  categoryList,
  categoryListSelect,
  children,
}) {
  return (
    <div
      className={cx(
        className,
        "flex flex-column justify-start full-height overflow-hidden",
      )}
    >
      {categoryList && (
        <SidebarCategory
          categoryList={categoryList}
          categoryListSelect={categoryListSelect}
        />
      )}
      <div
        className={cx(
          className,
          "flex flex-column justify-between full-height scroll-y",
        )}
      >
        <div className="scroll-y">
          {(title || onBack || icon) && (
            <SidebarHeader
              className="mx3 my2 pt1"
              title={title}
              icon={icon}
              onBack={onBack}
              onClose={onClose}
            />
          )}
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}

const FooterButton = props => (
  <ViewButton
    id="sidebar-footer-button"
    active
    px={4}
    ml="auto"
    mr="auto"
    mb={2}
    mt={1}
    className="circular shadowed"
    {...props}
  />
);
