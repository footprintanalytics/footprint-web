import React, { ReactNode } from "react";
import { t } from "ttag";
import SidebarHeader from "../SidebarHeader";
import SidebarCategory from "metabase/query_builder/components/SidebarCategory";
import {
  SidebarContentRoot,
  SidebarContentMain,
  FooterButton,
} from "./SidebarContent.styled";

type Props = {
  className?: string;
  title?: string;
  icon?: string;
  color?: string;
  onBack?: () => void;
  onClose?: () => void;
  onDone?: () => void;
  doneButtonText?: string;
  footer?: ReactNode;
  children?: ReactNode;
  categoryList?: any;
  categoryListSelect?: any;
};

function SidebarContent({
  className,
  title,
  icon,
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
}: Props) {
  console.log("SidebarContent categoryList", categoryList)
  return (
    <SidebarContentRoot className={className}>
      {categoryList && (
        <SidebarCategory
          categoryList={categoryList}
          categoryListSelect={categoryListSelect}
        />
      )}
      <SidebarContentMain data-testid="sidebar-content">
        {(title || icon || onBack) && (
          <SidebarHeader
            className="mx3 my2 pt1"
            title={title}
            icon={icon}
            onBack={onBack}
            onClose={onClose}
          />
        )}
        {children}
      </SidebarContentMain>
      {footer}
    </SidebarContentRoot>
  );
}

export default SidebarContent;
