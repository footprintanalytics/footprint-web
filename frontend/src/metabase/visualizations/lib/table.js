import { isNumber, isCoordinate } from "metabase-lib/types/utils/isa";

export function getTableClickedObjectRowData(
  [series],
  rowIndex,
  columnIndex,
  isPivoted,
  data,
) {
  const { rows, cols } = series.data;

  // if pivoted, we need to find the original rowIndex from the pivoted row/columnIndex
  const originalRowIndex = isPivoted
    ? data.sourceRows[rowIndex][columnIndex]
    : rowIndex;

  // originalRowIndex may be null if the pivot table is empty in that cell
  if (originalRowIndex === null) {
    return null;
  } else {
    return rows[originalRowIndex].map((value, index) => ({
      value,
      col: cols[index],
    }));
  }
}

export function getTableCellClickedObject(
  data,
  settings,
  rowIndex,
  columnIndex,
  isPivoted,
  clickedRowData,
) {
  const { rows, cols } = data;

  const column = cols[columnIndex];
  const row = rows[rowIndex];
  const value = row[columnIndex];

  if (isPivoted) {
    // if it's a pivot table, the first column is
    if (columnIndex === 0) {
      return row._dimension;
    } else {
      return {
        value,
        column,
        settings,
        dimensions: [row._dimension, column._dimension],
        data: clickedRowData,
      };
    }
  } else if (column.source === "aggregation") {
    return {
      value,
      column,
      settings,
      dimensions: cols
        .map((column, index) => ({ value: row[index], column }))
        .filter(dimension => dimension.column.source === "breakout"),
      origin: { rowIndex, row, cols },
      data: clickedRowData,
    };
  } else {
    return {
      value,
      column,
      settings,
      origin: { rowIndex, row, cols },
      data: clickedRowData,
    };
  }
}

export function getTableHeaderClickedObject(
  data,
  columnIndex,
  isPivoted,
  query,
) {
  const column = data.cols[columnIndex];
  if (isPivoted) {
    // if it's a pivot table, the first column is
    if (columnIndex >= 0 && column) {
      return column._dimension;
    } else {
      return null; // FIXME?
    }
  } else {
    return {
      column,
      dimension:
        typeof query?.dimensionForColumn === "function"
          ? query?.dimensionForColumn(column)
          : null,
    };
  }
}

/*
 * Returns whether the column should be right-aligned in a table.
 * Includes numbers and lat/lon coordinates, but not zip codes, IDs, etc.
 */
export function isColumnRightAligned(column) {
  // handle remapped columns
  if (column && column.remapped_to_column) {
    column = column.remapped_to_column;
  }
  return isNumber(column) || isCoordinate(column);
}

export function parseChart(datas, chartType, cellId) {
  const chartDom = document.getElementById(cellId);
  if (!chartDom) return;
  const chart = window.echarts?.init(chartDom);
  if (!chart) return;
  const option = {
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
      splitLine: { show: false },
    },
    grid: [
      {
        left: 2,
        top: 4,
        right: 2,
        bottom: 4,
      },
    ],
    tooltip: {
      show: true,
      trigger:"item",
      // trigger: chartType === "bar_chart" ?"item":"axis",
      position: [0, 0],
      padding: [3, 3],
      textStyle: {
        fontSize: 6,
      },
      formatter: function (params) {
        const value = params?.value;
        return value.toString();
      },
    },
    series: [
      {
        data: datas,
        type: chartType === "bar_chart" ? "bar" : "line",
        areaStyle: {},
        smooth: true,
        symbol: "circle",
        barMaxWidth: 15,
        barMinWidth: 3,
        barMinHeight: 0,
      },
    ],
  };
  chart?.setOption(option);
  // chart?.resize()
}

export function parseValue2ChartData(str) {
  try {
    const arr = JSON.parse(str);
    if (Array.isArray(arr)) {
      let datas = arr.map(Number);
      if (datas.length < 7) {
        const datasReverse = [...datas.reverse()];
        for (let i = 0; i < 7 - datas.length; i++) {
          datasReverse.push(0);
        }
        datas = datasReverse.reverse();
      }
      return datas;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

export function isShowChart(str) {
  return str === "bar_chart" || str === "line_chart";
}
