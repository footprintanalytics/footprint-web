import React, {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Tooltip from "metabase/components/Tooltip";
import { TooltipProps } from "metabase/components/Tooltip/Tooltip";
import { LinkRoot } from "./Link.styled";
import cx from "classnames";
import { formatLink2Growth } from "metabase/growth/utils/utils";

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
  const [link, setLink] = useState(
    <LinkRoot
      {...props}
      to={to}
      className={cx(props.className, "Link")}
      disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled}
    >
      {children}
    </LinkRoot>,
  );
  useEffect(() => {
    formatLink2Growth(location?.pathname, to).then(data => {
      setLink(
        <LinkRoot
          {...props}
          to={data}
          className={cx(props.className, "Link")}
          disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          aria-disabled={disabled}
        >
          {children}
        </LinkRoot>,
      );
    });
  }, [to, children]);

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
