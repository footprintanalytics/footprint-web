import _ from "underscore";
import { sumBy } from "lodash";

export const formateCircleChartData = (rows, levelIndexs, dataIndex) => {
  const rowsTemp = _.filter(rows, item => item[dataIndex] > 0);
  return deepFormatData(rowsTemp, levelIndexs, dataIndex, 0);
};

const deepFormatData = (rowsDatas, levelIndexs, dataIndex, level) => {
  const datas = [];
  datas.length;
  const group = _.groupBy(rowsDatas, levelIndexs[level]);
  Object.keys(group).forEach(key => {
    const list = group[key];
    const value = sumBy(list, item => item[dataIndex]);
    let row = { name: key, value: value };
    const nextLevel = level + 1;
    if (levelIndexs.length > nextLevel) {
      row = {
        ...row,
        children: deepFormatData(list, levelIndexs, dataIndex, nextLevel),
      };
    }
    datas.push(row);
  });
  return datas;
};
