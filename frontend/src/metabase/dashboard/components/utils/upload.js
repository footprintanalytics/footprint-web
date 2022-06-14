import { draw } from "./draw";
import { uploadFileData } from "metabase/lib/oss";

export const upload = async ({ fileName, elementId, thumbMode }) => {
  const img = await draw({
    elementId,
    thumbMode,
    noBrand: true,
    height: 480 * 3,
  });
  await uploadFileData({ fileName, data: img });
};

// export const copy = async ({ fileName, newFileName }) => {
//   try {
//     await client.copy(newFileName, fileName);
//   } catch (error) {}
// };
