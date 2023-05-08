import React, { useEffect, useRef, useState } from "react";

const proxyLink = "https://rlp-proxy.herokuapp.com/v2?url=";
export const placeholderImg = "https://i.imgur.com/UeDNBNQ.jpeg";

function isValidResponse(res: APIResponse | null): boolean {
  if (!res) return false;
  return (
    res.title !== null &&
    res.description !== null &&
    res.image !== null &&
    res.siteName !== null &&
    res.hostname !== null &&
    res.title !== undefined &&
    res.description !== undefined &&
    res.image !== undefined &&
    res.siteName !== undefined &&
    res.hostname !== undefined &&
    res.image !== "null" &&
    !res.image.startsWith("/")
  );
}

export interface LinkPreviewProps {
  url: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  descriptionLength?: number;
  borderRadius?: string | number;
  imageHeight?: string | number;
  textAlign?: "left" | "right" | "center";
  margin?: string | number;
  fallback?: JSX.Element[] | JSX.Element | null;
  backgroundColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  borderColor?: string;
  showLoader?: boolean;
  customLoader?: JSX.Element[] | JSX.Element | null;
  openInNewTab?: boolean;
  fetcher?: (url: string) => Promise<APIResponse | null>;
  fallbackImageSrc?: string;
  explicitImageSrc?: string;
  /* Whether the placeholder image is displayed in case no image could be scraped */
  showPlaceholderIfNoImage?: boolean;
  onSuccess?: (metadata: APIResponse | null) => void;
}

export interface APIResponse {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  hostname: string | null;
}

export function urlPreview(url: string, fetcher: any = null) {
  console.log("urlPreview", url);
  if (fetcher) {
    fetcher(url)
      .then((res: APIResponse | null) => {
        let metadata;
        if (isValidResponse(res)) {
          metadata = res;
          return res;
          // setMetadata(res);
        } else {
          metadata = null;
          return null;
        }
      })
      .catch((err: Error) => {
        console.error(err);
        console.error("No metadata could be found for the given URL.");
        return null;
      });
  } else {
    fetch(proxyLink + url)
      .then(res => res.json())
      .then(res => {
        // setMetadata(res.metadata as unknown as APIResponse);
        return res.metadata;
      })
      .catch((err: Error) => {
        console.error(err);
        console.error("No metadata could be found for the given URL.");
        return null;
      });
  }
}
