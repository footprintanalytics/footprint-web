import { getOssUrl } from "metabase/lib/image";
import drawUtil from "metabase/containers/market/picture/utils/drawUtil";
import { discordAccount, imgLogo, imgTwitter, today } from "../data/constant";

export const template1 = ({ data, title, tableNames }) => {
  const canvasWidth = 960 * 1.5;
  const canvasHeight = 540 * 1.5;

  const skWidth = 960;
  const skHeight = 540;

  const wMulti = canvasWidth / skWidth;
  const hMulti = canvasHeight / skHeight;

  const {
    drawBg,
    drawBgRound,
    drawImage,
    drawImageRound,
    drawTextCenter,
    drawTextRight,
    drawTextLeft,
    formatPrice,
  } = new drawUtil(wMulti, hMulti);

  async function drawFooter(ctx) {
    await drawImage(ctx, imgLogo, 25, 500, 126, 26);
    drawTextRight(ctx, `Update ${today}`, 760, 520, "#9090D8", 14);
    drawBg(ctx, "#8F92D9", 775, 505, 2, 20);
    await drawImage(ctx, imgTwitter, 790, 505, 19, 19);
    drawTextLeft(ctx, discordAccount, 820, 520, "#9090D8", 14);
  }

  async function drawList(ctx) {
    drawTextLeft(ctx, tableNames[0], 100, 100, "#000000", 14);
    drawTextRight(ctx, tableNames[1], 370, 100, "#000000", 14);
    drawTextLeft(ctx, tableNames[2], 440, 100, "#000000", 14);

    const blockMaxWidth = 460;
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

      drawTextLeft(ctx, item[1], 100, 140 + index * lineHeight, "#000000", 14);
      drawTextRight(
        ctx,
        `$${formatPrice(item[2].toFixed(0))}`,
        370,
        140 + index * lineHeight,
        "#000000",
        14,
      );

      const blockWidth =
        blockInitWidth + (item[3] / blockMaxValue) * blockMaxWidth;
      drawBg(ctx, "#3434B2", 440, 122 + index * lineHeight, blockWidth, 25);
      const blockText = `${(item[3] * 100).toFixed(0)}%`;
      drawTextRight(
        ctx,
        blockText,
        440 + blockWidth - 5,
        138 + index * lineHeight,
        "#ffffff",
        12,
      );
    }
  }

  async function drawMiddle(ctx) {
    drawBgRound(
      ctx,
      "#ffffffc8",
      24,
      65,
      skWidth - 24 * 2,
      skHeight - 60 * 2,
      20,
    );
    await drawList(ctx);
  }

  const drawTitle = ctx => {
    drawTextCenter(ctx, title, skWidth / 2, 40, "#3434B2", 20, "bold");
  };

  const drawPicBg = async ctx => {
    await drawImage(ctx, getOssUrl("img-oa-bg1.png"), 0, 0, skWidth, skHeight);
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
