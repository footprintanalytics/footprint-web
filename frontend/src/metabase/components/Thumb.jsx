/* eslint-disable react/prop-types */
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import { useImage } from "react-render-image/dist/index.cjs";
import "./PreviewDashboardCard.css";

const Thumb = ({
  src,
  name,
  backgroundModel = true,
  defaultThumb = "default_thumb.png",
}) => {
  const { loaded, errored } = useImage({ src });
  console.log("src", src);
  if (loaded) {
    if (!backgroundModel) {
      return <img src={src} alt={name} />;
    }
    return (
      <div
        className="preview-dashboard-card__thumb"
        style={{ backgroundImage: `url('${src}')` }}
      >
        <img src={src} alt={name} />
      </div>
    );
  }
  if (errored) {
    return (
      <div className={"preview-dashboard-card__default-thumb-container"}>
        <div
          className="preview-dashboard-card__default-thumb"
          style={{
            backgroundImage: `url(${getOssUrl(defaultThumb)})`,
          }}
        />
      </div>
    );
  }
  return <div className="preview-dashboard-card__thumb" />;
};

export default Thumb;
