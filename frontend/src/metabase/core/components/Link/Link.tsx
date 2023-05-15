import React, { CSSProperties, HTMLAttributes, ReactNode } from "react";
import Tooltip from "metabase/components/Tooltip";
import { TooltipProps } from "metabase/components/Tooltip/Tooltip";
import { LinkRoot } from "./Link.styled";
import cx from "classnames";

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  to: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  tooltip?: string | TooltipProps;
  activeClassName?: string;
  activeStyle?: CSSProperties;
  onlyActiveOnIndex?: boolean;
}

const Link = ({
  to,
  children,
  disabled,
  tooltip,
  ...props
}: LinkProps): JSX.Element => {
  //https://www.footprint.network/@rogerD/NFT-Overview-Random-Games-Heros?nft_collection_contract_address=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&series_date=past30days
  let toLink = to;
  if (location?.pathname?.includes("/growth/") && !to?.includes("/growth/")) {
    if (to?.includes("/@")) {
      toLink = to.replace("/@", "/growth/@");
    } else if (to?.includes("/public/")) {
      toLink = to.replace("/public/", "/growth/public/");
    }
  }

  const link = (
    <LinkRoot
      {...props}
      to={toLink}
      className={cx(props.className, "Link")}
      disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled}
    >
      {children}
    </LinkRoot>
  );

  const tooltipProps =
    typeof tooltip === "string"
      ? {
          tooltip,
        }
      : tooltip;

  return tooltip ? (
    <Tooltip {...tooltipProps}>
      <span>{link}</span>
    </Tooltip>
  ) : (
    link
  );
};

export default Object.assign(Link, {
  Root: LinkRoot,
});
