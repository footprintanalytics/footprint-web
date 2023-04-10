import { theme } from "antd";
import { isDark } from "./dashboard/components/utils/dark";

const { darkAlgorithm, defaultAlgorithm } = theme;

const getThemeConfig = () => {
  if (isDark()) {
    const colorPrimary = "#6C70FF";
    const background = "#121828";
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
          colorPrimary: "#ff0000",
          colorItemTextHover: colorPrimary,
          colorItemTextHoverHorizontal: colorPrimary,
          colorSubItemBg: background,
          colorItemBgHover: "#4444FF22",
        },
        Card: {
          colorBgContainer: "#182034",
          lineWidth: 0,
        },
        Table: {
          colorBgContainer: "#182034",
          colorFillAlter: "#2B3346",
        },
        Typography: {
          colorLink: colorPrimary,
        },
        Drawer: {
          colorBgElevated: background,
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
