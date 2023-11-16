import MetabaseUtils from "metabase/lib/utils";
import { isABPath } from "metabase/ab/utils/utils";

export function formatColor(index, defaultColor) {
  return isABPath() ? globalColors()[index] : defaultColor;
}
export function formatColors(colors) {
  return isABPath() ? globalColors() : colors;
}

export function globalColors() {
  return [
    ...globalPrimaryColors(),
    ...globalSecondaryColors(),
    ...globalSecondaryColors(),
    ...globalSecondaryColors(),
    ...globalSecondaryColors(),
    ...globalSecondaryColors(),
    ...globalSecondaryColors(),
  ];
}

export function globalPrimaryColors() {
  return [
        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#8C8C47F2",
        "#5AB8DBF2",
        "#9661BCF2",
        "#F6903DF2",
        "#008685F2",
        "#D37099F2",
      ];
}

export function globalSecondaryColors() {
  return [
        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#8C8C47F2",
        "#5AB8DBF2",
        "#9661BCF2",
        "#F6903DF2",
        "#008685F2",
        "#D37099F2",

        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#8C8C47F2",
        "#5AB8DBF2",
        "#9661BCF2",
        "#F6903DF2",
        "#008685F2",
        "#D37099F2",
      ];
}

export function globalColorsMore() {
  return [...globalColors()];
}
