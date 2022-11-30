import { message } from "antd";
import { saveAs } from "file-saver";
import { draw } from "./draw";
import { forceVisible } from "react-lazyload";

export const download = ({ fileName, elementId }) => {
  const hide = message.loading(
    "Taking a screenshot, this may take some time...",
    0,
  );

  const cache = localStorage.getItem(elementId);
  if (cache) {
    saveAs(cache, fileName);
    hide();
    return;
  }

  setTimeout(() => {
    try {
      const element = document.getElementById(elementId);
      const elementHeight = element.style.height;
      element.scrollTop = 0;
      element.style.height = "auto";
      setTimeout(() => {
        forceVisible();
        setTimeout(async () => {
          const img = await draw({ elementId });
          saveAs(img, fileName.endsWith(".png") ? fileName : `${fileName}.png`);
          element.style.height = elementHeight;
          hide();
        }, 3000);
      }, 300);
    } catch (error) {}
  }, 300);
};
