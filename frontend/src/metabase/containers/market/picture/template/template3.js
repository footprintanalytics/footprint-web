import drawUtil from "metabase/containers/market/picture/utils/drawUtil";
import {
  discordAccount,
  imgLogoWhite,
  imgTwitterWhite,
  today,
} from "../data/constant";

export const template3 = ({ data, title, tableNames }) => {
  const canvasWidth = 960 * 1.5;
  const canvasHeight = 540 * 1.5;

  const skWidth = 960;
  const skHeight = 540;

  const wMulti = canvasWidth / skWidth;
  const hMulti = canvasHeight / skHeight;

  const {
    drawBg,
    drawBgRoundStroke,
    drawImage,
    drawImageRound,
    drawTextCenter,
    drawTextRight,
    drawTextLeft,
    drawTextCenterMultiLine,
  } = new drawUtil(wMulti, hMulti);

  async function drawFooter(ctx) {
    await drawImage(ctx, imgLogoWhite, 55, 490, 126, 26);
    drawTextRight(ctx, `Update ${today}`, 760, 510, "#ffffff", 14);
    drawBg(ctx, "#ffffff", 775, 495, 2, 20);
    await drawImage(ctx, imgTwitterWhite, 790, 495, 19, 19);
    drawTextLeft(ctx, discordAccount, 820, 510, "#ffffff", 14);
  }

  async function drawList(ctx) {
    const blockMaxHeight = 200;
    const blockInitHeight = 20;
    const blockMaxValue = Math.max(...data.map(item => item[2]));
    const lineWidth = 80;
    for (const item of data) {
      const index = data.indexOf(item);
      if (item[0]) {
        await drawImageRound(
          ctx,
          item[0],
          100 + index * lineWidth,
          350,
          50,
          50,
          25,
        );
      }
      drawTextCenterMultiLine(
        ctx,
        item[1].split(" "),
        125 + index * lineWidth,
        430,
        "#ffffff",
        12,
      );

      const blockHeight =
        blockInitHeight + (item[2] / blockMaxValue) * blockMaxHeight;
      drawBg(
        ctx,
        "#3B3BD5",
        100 + index * lineWidth,
        330 - blockHeight,
        50,
        blockHeight,
      );
      const blockText = `${(item[2] * 100).toFixed(2)}%`;
      drawTextCenter(
        ctx,
        blockText,
        125 + index * lineWidth,
        315 - blockHeight,
        "#ffffff",
        12,
      );
    }
  }

  async function drawMiddle(ctx) {
    drawBgRoundStroke(
      ctx,
      "#3943C1",
      50,
      65,
      skWidth - 50 * 2,
      skHeight - 65 * 2,
      20,
    );
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
