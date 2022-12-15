import { isProduction, isUpgradeTest } from "metabase/env";

export const ossPath = path => {
  return isProduction || isUpgradeTest ? path : `beta/${path}`;
};
