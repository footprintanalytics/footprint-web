import { ossPath } from "metabase/lib/ossPath";
import {
  staticBucketUrl,
  staticBucketUrlDefault,
  staticBucketUrlHk,
} from "metabase/env";

export function getOssUrl(fileName, config) {
  if (!fileName) {
    return "";
  }

  const releaseHost = staticBucketUrl;
  let url = `${releaseHost}/${fileName}`;

  const isFullUrl = fileName.startsWith("http");
  if (isFullUrl) {
    try {
      const urlObject = new URL(fileName);
      url = `${releaseHost}${urlObject.pathname}`;
    } catch (e) {}
  }

  if (config) {
    if (!isFullUrl && config.diffReleaseBeta) {
      url = `${releaseHost}/${ossPath(fileName)}`;
    }
    if (config.resize) {
      url += `?image_process=resize,w_1200/crop,h_630/format,jpg`;
    }
  }

  return url;
}

export const formatOssUrl = url => {
  if (!url) {
    return url;
  }
  return url
    .replaceAll(staticBucketUrlHk, staticBucketUrlDefault)
    .replaceAll(staticBucketUrlDefault, staticBucketUrl);
};
