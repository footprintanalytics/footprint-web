import React from "react";

import ExternalLink from "metabase/core/components/ExternalLink";
import Link from "metabase/core/components/Link";
import { IFRAMED } from "metabase/lib/dom";
import { getDataFromClicked } from "metabase-lib/parameters/utils/click-behavior";
import { isURL } from "metabase-lib/types/utils/isa";
import { renderLinkTextForClick, renderLinkURLForClick } from "./link";
import { formatValue, getRemappedValue } from "./value";

import type { OptionsType } from "./types";

function isSafeProtocol(protocol: string) {
  return (
    protocol !== "javascript:" && protocol !== "data:" && protocol !== "file:"
  );
}

function isDefaultLinkProtocol(protocol: string) {
  return (
    protocol === "http:" || protocol === "https:" || protocol === "mailto:"
  );
}

export function getUrlProtocol(url: string) {
  try {
    const { protocol } = new URL(url);
    return protocol;
  } catch (e) {
    return undefined;
  }
}

export function formatUrl(value: string, options: OptionsType = {}) {
  const { jsx, rich } = options;

  const url = getLinkUrl(value, options);
  if (jsx && rich && url) {
    const text = getLinkText(value, options);
    const targetObject = IFRAMED && !'growthly'.includes(url.toLowerCase()) ? { target: "_blank" } : {};
    console.log('targetObject=>', targetObject)
    let formatedURL = formatUrl2Growth(location?.pathname, url);
    formatedURL = formatUrl2AB(location?.pathname, formatedURL);
    if (formatedURL.startsWith("/fga")
      || formatedURL.startsWith('/portfolio-fga')
      || formatedURL.startsWith('/growthly')
    ) {
      return (
        <Link
          to={formatedURL}
          {...targetObject}
        >
          {text}
        </Link>
      );
    }
    return (
      <ExternalLink
        className="link link--wrappable"
        href={formatedURL}
        {...targetObject}
      >
        {text}
      </ExternalLink>
    );
  } else {
    return value;
  }
}

function getLinkText(value: string, options: OptionsType) {
  const { view_as, link_text, clicked } = options;

  const isExplicitLink = view_as === "link";
  const hasCustomizedText = link_text && clicked;

  if (isExplicitLink && hasCustomizedText) {
    return renderLinkTextForClick(
      link_text,
      getDataFromClicked(clicked) as any,
    );
  }

  return (
    getRemappedValue(value, options) ||
    formatValue(value, { ...options, view_as: null })
  );
}

function getLinkUrl(
  value: string,
  { view_as, link_url, clicked, column }: OptionsType,
) {
  const isExplicitLink = view_as === "link";
  const hasCustomizedUrl = link_url && clicked;

  if (isExplicitLink && hasCustomizedUrl) {
    let finalLinkUrl = link_url
    if (finalLinkUrl?.includes("project/{{project}}")) {
      finalLinkUrl = finalLinkUrl.replace("project/{{project}}", `project/${encodeURIComponent(localStorage.getItem("LatestGAProject") || "") || ""}`);
    }
    return renderLinkURLForClick(finalLinkUrl, getDataFromClicked(clicked) as any);
  }

  const protocol = getUrlProtocol(value);
  const isValueSafeLink = protocol && isSafeProtocol(protocol);

  if (!isValueSafeLink) {
    return null;
  }

  if (isExplicitLink) {
    return value;
  }

  const isDefaultProtocol = protocol && isDefaultLinkProtocol(protocol);
  const isMaybeLink = view_as === "auto";

  if (isMaybeLink && isDefaultProtocol) {
    return value;
  }

  if (view_as === undefined && (isURL(column) || isDefaultProtocol)) {
    return value;
  }

  return null;
}

export function formatUrl2Growth(
  pathname: string,
  href: string | undefined,
): string {
  if (!href) {
    return "";
  }
  let toLink = href;
  if (pathname?.includes("/growth/") && !href?.includes("/growth/")) {
    if (href?.includes("/@")) {
      toLink = href.replace("/@", "/growth/@");
    } else if (href?.includes("/public/")) {
      toLink = href.replace("/public/", "/growth/public/");
    }
  }
  return toLink ?? "";
}

export function formatUrl2AB(
  pathname: string,
  href: string | undefined,
): string {
  if (!href) {
    return "";
  }
  let toLink = href;
  if (pathname?.includes("/fga/") && !href?.includes("/fga/")) {
    if (href?.includes("/@")) {
      toLink = href.replace("/@", "/fga/@");
    } else if (href?.includes("/public/")) {
      toLink = href.replace("/public/", "/fga/public/");
    }
  }
  return toLink ?? "";
}
export function slugify(name: string) {
  return name && encodeURIComponent(name.toLowerCase().replace(/\s/g, "_"));
}
