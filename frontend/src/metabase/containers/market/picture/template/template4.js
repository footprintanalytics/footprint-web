import { getOssUrl } from "metabase/lib/image";
import drawUtil from "metabase/containers/market/picture/utils/drawUtil";
import {
  imgTwitterWhite,
  imgLogoWhite,
  today,
  discordAccount,
} from "../data/constant";

export const template4 = ({ data, title, tableNames }) => {
  const canvasWidth = 960 * 1.5;
  const canvasHeight = 540 * 1.5;

  const skWidth = 960;
  const skHeight = 540;

  const wMulti = canvasWidth / skWidth;
  const hMulti = canvasHeight / skHeight;

  const {
    drawBg,
    drawImage,
    drawImageRound,
    formatPrice,
    drawTextRight,
    drawTextLeft,
    drawTextLeftMultiLine,
  } = new drawUtil(wMulti, hMulti);

  async function drawFooter(ctx) {
    await drawImage(ctx, imgLogoWhite, 60, 50, 126, 26);
    drawTextLeft(ctx, `Update ${today}`, 60, 320, "#ffffff", 14);
    await drawImage(ctx, imgTwitterWhite, 60, 480, 19, 19);
    drawTextLeft(ctx, discordAccount, 90, 495, "#ffffff", 14);
  }

  async function drawList(ctx) {
    drawTextLeft(ctx, tableNames[0], 470, 40, "#ffffff", 14);
    drawTextRight(ctx, tableNames[1], 900, 40, "#ffffff", 14);

    const lineHeight = 45;
    for (const item of data) {
      const index = data.indexOf(item);
      if (item[0]) {
        await drawImageRound(
          ctx,
          item[0],
          420,
          60 + index * lineHeight,
          30,
          30,
          15,
        );
      }

      drawTextLeft(ctx, item[1], 470, 80 + index * lineHeight, "#ffffff", 16);
      drawTextRight(
        ctx,
        `$${formatPrice(item[2].toFixed(0))}`,
        900,
        80 + index * lineHeight,
        "#ffffff",
        16,
      );

      drawBg(ctx, "#ffffff", 410, 95 + index * lineHeight, 500, 1);
    }
  }

  async function drawMiddle(ctx) {
    await drawList(ctx);
  }

  const drawTitle = ctx => {
    drawTextLeftMultiLine(
      ctx,
      title.split(" "),
      60,
      200,
      "#ffffff",
      60,
      "bold",
    );
  };

  const drawPicBg = async ctx => {
    await drawImage(ctx, getOssUrl("img-oa-bg2.png"), 0, 0, skWidth, skHeight);
  };

  return new Promise(resolve => {
    setTimeout(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      await drawPicBg(ctx);
      // await drawBg(ctx, "#3334B2", 0, 0, skWidth, skHeight)

      await drawTitle(ctx);

      await drawMiddle(ctx);

      await drawFooter(ctx);

      resolve(canvas.toDataURL());
    }, 300);
  });
};
