import React, {
  AnchorHTMLAttributes,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useState,
} from "react";
import { getUrlTarget } from "metabase/lib/dom";
import { formatLink2Growth } from "metabase/growth/utils/utils";
import { LinkRoot } from "./ExternalLink.styled";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  target?: string;
  className?: string;
  children?: ReactNode;
}

const ExternalLink = forwardRef(function ExternalLink(
  { href, target = getUrlTarget(href), className, children, ...props }: Props,
  ref: Ref<HTMLAnchorElement>,
) {
  return (
    <LinkRoot
      ref={ref}
      href={href}
      className={className || "link"}
      target={target}
      // prevent malicious pages from navigating us away
      rel="noopener noreferrer"
      // disables quickfilter in tables
      onClickCapture={e => e.stopPropagation()}
      {...props}
    >
      {children}
    </LinkRoot>
  );
});

export default ExternalLink;
