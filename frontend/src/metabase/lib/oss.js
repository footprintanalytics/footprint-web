import { message } from "antd";
import OSS from "tiny-oss";
import { ossPath } from "./ossPath";
import { staticBucketKeyId, staticBucketKeySecret } from "metabase/env";

const client = new OSS({
  region: "oss-accelerate",
  accessKeyId: staticBucketKeyId,
  accessKeySecret: staticBucketKeySecret,
  bucket: "footprint-imgs",
  secure: true,
});

export const uploadFile = async ({ fileName, file }) => {
  try {
    await client.put(ossPath(fileName), file);
  } catch (error) {
    message.error("Upload failed, please try again later");
  }
};

export const uploadFileData = async ({ fileName, data }) => {
  try {
    await client.put(ossPath(fileName), dataURLtoFile(data));
  } catch (error) {}
};

const dataURLtoFile = dataurl => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
