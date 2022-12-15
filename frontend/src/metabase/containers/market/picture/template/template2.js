import drawUtil from "metabase/containers/market/picture/utils/drawUtil";
import {
  imgTwitterWhite,
  imgLogoWhite,
  today,
  discordAccount,
} from "../data/constant";

export const template2 = ({ data, title, tableNames }) => {
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
    drawTextLeft(ctx, tableNames[0], 100, 100, "#ffffff", 18);
    drawTextRight(ctx, tableNames[1], 330, 100, "#ffffff", 18);
    drawTextLeft(ctx, tableNames[2], 440, 100, "#ffffff", 18);

    const blockMaxWidth = 500;
    const blockInitWidth = 20;
    const blockMaxValue = Math.max(...data.map(item => item[3]));
    const lineHeight = 35;
    for (const item of data) {
      const index = data.indexOf(item);
      if (item[0]) {
        await drawImageRound(
          ctx,
          item[0],
          55,
          120 + index * lineHeight,
          28,
          28,
          14,
        );
      }

      drawTextLeft(ctx, item[1], 100, 140 + index * lineHeight, "#ffffff", 14);
      drawTextRight(
        ctx,
        `$${formatPrice(item[2].toFixed(2))}`,
        330,
        140 + index * lineHeight,
        "#ffffff",
        14,
      );

      const blockWidth =
        blockInitWidth + (item[3] / blockMaxValue) * blockMaxWidth;
      drawBg(ctx, "#3B3BD5", 400, 122 + index * lineHeight, blockWidth, 25);
      const blockText = `${(item[3] * 100).toFixed(0)}%`;
      drawTextRight(
        ctx,
        blockText,
        400 + blockWidth - 5,
        138 + index * lineHeight,
        "#ffffff",
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

  return new Promise(resolve => {
    setTimeout(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      // await drawPicBg(ctx);
      await drawBg(ctx, "#131649", 0, 0, skWidth, skHeight);

      await drawTitle(ctx);

      await drawMiddle(ctx);

      await drawFooter(ctx);

      resolve(canvas.toDataURL());
    }, 300);
  });
};
