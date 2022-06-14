import { globalColors } from "metabase/visualizations/lib/colors";

const handleChartStyle = series => {
  try {
    series.forEach(k => {
      const series_settings =
        k &&
        k.card &&
        k.card.visualization_settings &&
        k.card.visualization_settings.series_settings;
      if (
        k &&
        k.card &&
        k.card.visualization_settings &&
        k.card.visualization_settings.series_settings
      ) {
        Object.keys(series_settings).forEach(key => {
          if (series_settings[key]) {
            delete series_settings[key].color;
          }
        });
      }
    });
    return series;
  } catch (e) {}
};

export default handleChartStyle;

export function handlePieColorsSlices(slices, customColors) {
  return slices.map((item, index) => {
    return {
      ...item,
      color: customColors[item.key]
        ? customColors[item.key]
        : globalColors()[index % 10],
    };
  });
}

export function deleteCustomSettingColor(card) {
  if (
    card.visualization_settings &&
    card.visualization_settings["pie.colors"]
  ) {
    delete card.visualization_settings["pie.colors"];
  }
  if (
    card.visualization_settings &&
    card.visualization_settings.series_settings
  ) {
    const setting = card.visualization_settings.series_settings;
    Object.keys(setting).forEach(key => {
      if (setting[key]["color"]) {
        delete setting[key]["color"];
      }
    });
  }
  return card;
}
