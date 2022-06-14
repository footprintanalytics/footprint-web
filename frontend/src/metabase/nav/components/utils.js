import { t } from "ttag";
import { words } from "lodash";

const TRANSLATED_NAME_BY_MODEL_TYPE = {
  card: t`Question`,
  dashboard: t`Dashboard`,
  table: t`Table`,
  database: t`Database`,
  collection: t`Collection`,
  segment: t`Segment`,
  metric: t`Metric`,
  pulse: t`Pulse`,
};

export const getTranslatedEntityName = type =>
  TRANSLATED_NAME_BY_MODEL_TYPE[type] || null;

export const getSearchTexts = text => {
  return words(text, /[^ ]+/g)
    .map(s => s.trim())
    .filter(s => s !== "");
};
