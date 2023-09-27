import { theme } from "antd";
import { isDark } from "./dashboard/components/utils/dark";

const { darkAlgorithm, defaultAlgorithm } = theme;

const getThemeConfig = () => {
  if (isDark()) {
    const colorPrimary = "#6C70FF";
    const background = "#121828";
    const cardBg = "#182034";
    const selectBackground = "#1B1B1E";
    return {
      hashed: false,
      token: {
        colorPrimary: colorPrimary,
        borderRadius: 0,
        "colorPrimaryText": colorPrimary,
        "colorBgBase": background,
        "colorBgLayout": background,
        "colorPrimaryBg": "#6C70FF22",
        "colorBgContainer": background,
        colorBorderSecondary: "#4A5568",
      },
      components: {
        Menu: {
          colorItemTextHover: colorPrimary,
          colorItemTextHoverHorizontal: colorPrimary,
          colorSubItemBg: background,
          colorItemBgHover: "#4444FF22",
          colorItemTextSelected: colorPrimary,
        },
        Card: {
          colorBgContainer: cardBg,
          lineWidth: 0,
        },
        Table: {
          colorBgContainer: cardBg,
          colorFillAlter: "#2B3346",
        },
        Typography: {
          colorLink: colorPrimary,
        },
        Drawer: {
          colorBgElevated: background,
          colorPrimary: colorPrimary,
        },
        Button: {
          colorLink: colorPrimary,
          colorBgContainer: cardBg,
          colorPrimary: colorPrimary,
        },
        Radio: {
          colorPrimary: colorPrimary,
        },
        Select: {
          colorBgContainer: selectBackground,
          colorBgElevated: "#1C1C1E",
        },
        Input: {
          colorBgContainer: selectBackground,
        },
        InputNumber: {
          colorBgContainer: selectBackground,
        },
        Modal: {
          colorBgElevated: "#1B1B1E",
        },
        Tooltip: {
          colorBgSpotlight: "#2B2B2E",
        },
        Popover: {
          colorBgElevated: "#2B2B2E",
        },
      },
      algorithm: isDark() ? darkAlgorithm : defaultAlgorithm,
    };
  }
  return {
    hashed: false,
    token: {
      colorPrimary: "#3434B2",
    }
  }
};

export default getThemeConfig;
