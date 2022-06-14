import { getOssUrl } from "metabase/lib/image";
import drawUtil from "metabase/containers/market/picture/utils/drawUtil";
import {
  discordAccount,
  imgLogoWhite,
  imgTwitterWhite,
  today,
} from "../data/constant";

export const template5 = ({ data, title, tableNames }) => {
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
    drawBgRound,
    drawTextCenter,
    drawTextRight,
    drawTextLeft,
    formatPrice,
  } = new drawUtil(wMulti, hMulti);

  async function drawFooter(ctx) {
    await drawImage(ctx, imgLogoWhite, 55, 490, 126, 26);
    drawTextRight(ctx, `Update ${today}`, 760, 510, "#ffffff", 14);
    drawBg(ctx, "#ffffff", 775, 495, 2, 20);
    await drawImage(ctx, imgTwitterWhite, 790, 495, 19, 19);
    drawTextLeft(ctx, discordAccount, 820, 510, "#ffffff", 14);
  }

  async function drawList(ctx) {
    const lineHeight = 130;
    const lineWidth = 270;
    for (const item of data) {
      const index = data.indexOf(item);
      const xIndex = Math.floor(index / 3);
      const yIndex = index % 3;
      await drawBgRound(
        ctx,
        "#3434B2b8",
        140 + xIndex * lineWidth,
        123 + yIndex * lineHeight,
        180,
        55,
        40,
      );
      if (item[0]) {
        await drawBgRound(
          ctx,
          "#ffffff",
          101 + xIndex * lineWidth,
          81 + yIndex * lineHeight,
          96,
          96,
          48,
        );
        await drawImageRound(
          ctx,
          item[0],
          100 + xIndex * lineWidth,
          80 + yIndex * lineHeight,
          100,
          100,
          50,
        );
      }
      drawTextLeft(
        ctx,
        item[1],
        220 + xIndex * lineWidth,
        110 + yIndex * lineHeight,
        "#ffffff",
        14,
      );
      drawTextLeft(
        ctx,
        "TVL",
        220 + xIndex * lineWidth,
        143 + yIndex * lineHeight,
        "#ffffffcc",
        12,
      );
      drawTextLeft(
        ctx,
        formatPrice(item[2].toFixed(0)),
        220 + xIndex * lineWidth,
        163 + yIndex * lineHeight,
        "#ffffffcc",
        12,
      );
    }
  }

  async function drawMiddle(ctx) {
    await drawList(ctx);
  }

  const drawTitle = ctx => {
    drawTextCenter(ctx, title, skWidth / 2, 40, "#ffffff", 20, "bold");
  };

  const drawPicBg = async ctx => {
    await drawImage(ctx, getOssUrl("img-oa-bg3.png"), 0, 0, skWidth, skHeight);
  };

  return new Promise(resolve => {
    setTimeout(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      await drawPicBg(ctx);

      await drawTitle(ctx);

      await drawMiddle(ctx);

      await drawFooter(ctx);

      resolve(canvas.toDataURL());
    }, 300);
  });
};
