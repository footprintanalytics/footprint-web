/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "../../lib/helmet";

const Meta = ({
  title,
  description,
  keywords,
  image,
  imageWidth,
  imageHeight,
  siteName,
  viewport,
}) => {
  return (
    <Helmet>
      {/* title */}
      {title && <meta property="og:title" content={title} />}

      {/* description */}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {/* keywords */}
      {keywords && <meta property="keywords" content={keywords} />}

      {/* image */}
      {image && <meta property="og:image" content={image} />}
      {imageWidth && <meta property="og:image:width" content={imageWidth} />}
      {imageHeight && <meta property="og:image:height" content={imageHeight} />}

      {/* siteName */}
      {siteName && <meta property="og:site_name" content={siteName} />}

      {/* viewport */}
      {viewport && (
        <meta
          name="viewport"
          content={`width=device-width,initial-scale=${viewport},user-scalable=0`}
        />
      )}
    </Helmet>
  );
};

export default Meta;
