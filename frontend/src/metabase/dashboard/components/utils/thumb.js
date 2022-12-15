/* eslint-disable no-undef */
import { screenshotThumbnail } from "metabase/new-service";
import { isDev } from "metabase/env";

export const createThumb = async ({
  elementId,
  fileName,
  type,
  publicUuid,
  cssAdjustments = [],
  captureElementHeight,
}) => {
  try {
    const pathName = `guest/${type}/${publicUuid}`;
    const url = isDev ? process.env.TEST_URL : location.origin;

    await screenshotThumbnail({
      websiteUrl: `${url}/${pathName}`,
      fileName: `/${fileName}`,
      captureElement: {
        selector: elementId,
        height: captureElementHeight,
      },
      cssAdjustments: [
        {
          selector: ".html2canvas-filter",
          css: "display: none",
        },
        {
          selector: ".waterMarkHome",
          css: "display: none",
        },
        ...cssAdjustments,
      ],
    });
  } catch (e) {}
};
