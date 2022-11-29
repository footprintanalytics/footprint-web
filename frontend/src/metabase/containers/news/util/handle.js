import { uploadFileData } from "metabase/lib/oss";
import { v4 as uuidv4 } from "uuid";
import { getOssUrl } from "metabase/lib/image";
import { uniq } from "lodash";

let canvas = undefined;

export const getBase64 = img => {
  function getBase64Image(img, width, height) {
    if (!canvas) {
      canvas = document.createElement("canvas");
    }
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = img;
  return new Promise((resolve, reject) => {
    if (img) {
      image.onload = () => {
        const base64 = getBase64Image(image);
        resolve(base64);
      };
      image.onerror = () => {
        resolve();
      };
    } else {
      resolve();
    }
  });
};

export const base64UploadToOss = async data => {
  const suffix = data.replace(/data:image\/([^;]+).*/i, "$1");
  const imageName = `${uuidv4()}.${suffix}`;
  const fileName = `article/${imageName}`;
  await uploadFileData({ fileName, data });
  return getUrl(fileName);
};

export const getUrl = fileName => {
  return getOssUrl(fileName, { diffReleaseBeta: true });
};

export const getSuffix = fileName => {
  const index = fileName.lastIndexOf(".");
  let suffix = "";
  if (index > -1) {
    suffix = fileName.substring(index, fileName.length);
  }
  return suffix;
};

export const getArticleFileName = file => {
  return `article/${uuidv4()}${getSuffix(file.name)}`;
};

export const formatHtmlFromImg = async html => {
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const srcReg = /src=[\"\"]?([^\"\"]*)[\"\"]?/i;
  const arr = html.match(imgReg);
  let result = `${html}`;
  if (arr) {
    let base64ImgArray = [];
    let otherHostImgArray = [];
    arr.forEach(data => {
      const src = data.match(srcReg);
      if (src) {
        const base64ImgFile = src.length > 1 && src[1].startsWith("data:image");
        const otherHostImgFile =
          src.length > 1 && !src[1].includes(".footprint.network");
        if (base64ImgFile) {
          base64ImgArray.push(src[1]);
        } else if (otherHostImgFile) {
          otherHostImgArray.push(src[1]);
        }
      }
    });
    base64ImgArray = uniq(base64ImgArray);
    for (const data of base64ImgArray) {
      const url = await base64UploadToOss(data);
      result = result.replaceAll(data, url);
    }
    otherHostImgArray = uniq(otherHostImgArray);
    for (const img of otherHostImgArray) {
      const data = await getBase64(img);
      if (data) {
        const url = await base64UploadToOss(data);
        result = result.replaceAll(img, url);
      }
    }
  }
  return result;
};

export const googleSheetToCleanHtml = html => {
  const imgReg = /<img.*?(?:<\/span>)/gi;
  const arr = html.match(imgReg);
  let result = `${html}`;
  if (arr) {
    for (const data of arr) {
      result = result.replaceAll(
        data,
        `</span>${data.replaceAll("</span>", "")}`,
      );
    }
  }
  result = result
    .replaceAll(
      '<p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p>',
      "<p/>",
    )
    .replaceAll('<br class="ProseMirror-trailingBreak">', "")
    .replaceAll("strong", "span")
    .replaceAll(/alt=['"]([\w\W]+?)['"]/g, "");
  return result;
};

export const formatImgAlt = (html, alt) => {
  if (!html) {
    return html;
  }
  let result = `${html}`;
  result = result
    .replaceAll(/alt=['"]([\w\W]+?)['"]/g, "")
    .replaceAll(/(<img.*?src.*?)((?:>|\/>))/g, `$1 alt=\"${alt}\" $2`);
  return result;
};
