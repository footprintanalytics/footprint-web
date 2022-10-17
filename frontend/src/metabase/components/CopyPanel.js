import withToast from "metabase/hoc/Toast";
import CopyToClipboard from "react-copy-to-clipboard";
import React from "react";

const Copy = withToast(
  ({ text, children, triggerToast, successText = "Copied to clipboard" }) => (
    <CopyToClipboard text={text} onCopy={() => triggerToast(successText)}>
      <span className="cursor-pointer">{children}</span>
    </CopyToClipboard>
  ),
);

export default Copy;
