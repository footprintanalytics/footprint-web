import { useSize } from "ahooks";
import {
  footprintWidthMobile,
  footprintWidthPad,
} from "metabase/styled-components/theme";

export function useDeviceInfo() {
  useSize(document.documentElement);
  return deviceInfo();
}

export function deviceInfo() {
  const { innerWidth, innerHeight } = window || {};
  const width = innerWidth || 0;
  const height = innerHeight || 0;
  return {
    isPC: width > footprintWidthPad,
    isMobile: width <= footprintWidthMobile,
    isPad: width > footprintWidthMobile && width <= footprintWidthPad,
    screenWidth: width,
    screenHeight: height,
  };
}
