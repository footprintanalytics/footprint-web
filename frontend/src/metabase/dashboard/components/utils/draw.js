import html2canvas from "html2canvas";
import { getOssUrl } from "metabase/lib/image";

export const draw = ({ elementId, thumbMode, noBrand = false, height }) => {
  return new Promise(resolve => {
    setTimeout(async () => {
      const ignoreElements = e => {
        if (typeof e.className === "string") {
          if (thumbMode && e.className.indexOf("thumbFilter") > -1) {
            return true;
          }
          if (!noBrand) {
            if (e.className.indexOf("html2canvas-filter") > -1) {
              return true;
            } else {
              return false;
            }
          } else {
            if (e.className.indexOf("html2canvas-filter") > -1) {
              return true;
            } else if (e.className.indexOf("watermark") > -1) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      };

      const element = document.getElementById(elementId);
      if (!element) {
        return;
      }

      const options = {
        ignoreElements,
        backgroundColor: "#f9fbfc",
        scale: 1,
        useCORS: true,
        allowTaint: true,
      };
      if (height) {
        options.height = height;
      }
      const chartCanvas = await html2canvas(element, options);

      const chartImg = await loadImg(chartCanvas.toDataURL());
      const posterCanvas = document.createElement("canvas");
      posterCanvas.width = chartCanvas.width;
      posterCanvas.height = !noBrand
        ? chartCanvas.height + 70
        : chartCanvas.height;

      const posterCtx = posterCanvas.getContext("2d");
      posterCtx.fillStyle = "white";
      posterCtx.fillRect(0, 0, posterCanvas.width, posterCanvas.height);
      posterCtx.drawImage(chartImg, 0, 0);

      if (!noBrand) {
        posterCtx.font = "normal normal 100 14px arial";
        posterCtx.fillStyle = "#ADADAD";
        posterCtx.textAlign = "end";
        posterCtx.fillText(
          "https://www.footprint.network",
          posterCanvas.width - 30,
          30,
        );

        const sloganImg = await loadImg(getOssUrl("20210722110625.png"));
        const sloganImgWidth = 154;
        const sloganImgHeight = 50;
        posterCtx.drawImage(
          sloganImg,
          40,
          chartCanvas.height + 10,
          sloganImgWidth,
          sloganImgHeight,
        );
      }

      resolve(posterCanvas.toDataURL());
    }, 300);
  });
};

const loadImg = url => {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.setAttribute("crossOrigin", "Anonymous");
    img.onload = () => resolve(img);
  });
};
