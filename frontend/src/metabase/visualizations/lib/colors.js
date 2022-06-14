import MetabaseUtils from "metabase/lib/utils";

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
  return MetabaseUtils.isCoin360()
    ? [
        "#ffa72370",
        "#46b99d70",
        "#61509070",
        "#bb622170",
        "#6bb7ff70",
        "#85ca6d70",
        "#adbbda70",
      ]
    : [
        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#7262FDF2",
        "#5AB8DBF2",
        "#9661BCF2",
        "#F6903DF2",
        "#008685F2",
        "#D37099F2",
      ];
}

export function globalSecondaryColors() {
  return MetabaseUtils.isCoin360()
    ? [
        "#ffa72370",
        "#46b99d70",
        "#61509070",
        "#bb622170",
        "#6bb7ff70",
        "#85ca6d70",
        "#adbbda70",

        "#ffa72370",
        "#46b99d70",
        "#61509070",
        "#bb622170",
        "#6bb7ff70",
        "#85ca6d70",
        "#adbbda70",
      ]
    : [
        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#7262FDF2",
        "#5AB8DBF2",
        "#9661BCF2",
        "#F6903DF2",
        "#008685F2",
        "#D37099F2",

        "#5C5CE0F2",
        "#42C090F2",
        "#65789BF2",
        "#F6BD16F2",
        "#7262FDF2",
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
