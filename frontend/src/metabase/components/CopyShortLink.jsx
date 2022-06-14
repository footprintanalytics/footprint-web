import React from "react";
import { getShortLink } from "metabase/new-service";
import { message } from "antd";
import copy from "copy-to-clipboard";
import cx from "classnames";

const CopyShortLink = params => {
  const { url, className, style, children } = params;
  const onClickCopy = async e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("short link copy");
    if (!url || url.includes("localhost")) {
      return;
    }
    const hide = message.loading("Loading...", 0);
    try {
      const { shortLink } = await getShortLink({
        url: encodeURIComponent(url),
        domain: 1,
      });
      copy(shortLink || "");
      message.success("Create & copy short link success！");
    } finally {
      hide();
    }
  };

  return (
    <div
      className={cx("cursor-pointer", className)}
      style={style}
      onClick={onClickCopy}
    >
      {children}
    </div>
  );
};

export default CopyShortLink;
