import {
  registerVisualization,
  setDefaultVisualization,
} from "metabase/visualizations";

import Scalar from "./visualizations/Scalar";
import SmartScalar from "./visualizations/SmartScalar";
import Progress from "./visualizations/Progress";
import Table from "./visualizations/Table";
import Text from "./visualizations/Text";
import Image from "./visualizations/Image";
import Video from "./visualizations/Video";
import LineChart from "./visualizations/LineChart";
import BarChart from "./visualizations/BarChart";
import WaterfallChart from "./visualizations/WaterfallChart";
import RowChart from "./visualizations/RowChart";
import Bubble from "./visualizations/Bubble";
import PieChart from "./visualizations/PieChart";
import AreaChart from "./visualizations/AreaChart";
import ComboChart from "./visualizations/ComboChart";
import MapViz from "./visualizations/Map";
import ScatterPlot from "./visualizations/ScatterPlot";
import Funnel from "./visualizations/Funnel";
import Gauge from "./visualizations/Gauge";
import ObjectDetail from "./visualizations/ObjectDetail";
import PivotTable from "./visualizations/PivotTable";
import RowRace from "./visualizations/RowRace";
import LineRace from "./visualizations/LineRace";
import Circle from "./visualizations/Circle";
import TreeMap from "./visualizations/TreeMap";
import DynamicPie from "./visualizations/DynamicPie";
import Sunburst from "./visualizations/Sunburst";
import Rose from "./visualizations/Rose";
import NestedPies from "./visualizations/NestedPies";
import BarStack from "./visualizations/BarStack";
import DoubleScalar from "metabase/visualizations/visualizations/DoubleScalar";

export default function() {
  registerVisualization(Scalar);
  registerVisualization(SmartScalar);
  registerVisualization(Progress);
  registerVisualization(Gauge);
  registerVisualization(Table);
  registerVisualization(Text);
  registerVisualization(Image);
  registerVisualization(Video);
  registerVisualization(LineChart);
  registerVisualization(AreaChart);
  registerVisualization(BarChart);
  registerVisualization(WaterfallChart);
  registerVisualization(ComboChart);
  registerVisualization(RowChart);
  registerVisualization(ScatterPlot);
  registerVisualization(PieChart);
  registerVisualization(MapViz);
  registerVisualization(Funnel);
  registerVisualization(ObjectDetail);
  registerVisualization(PivotTable);
  registerVisualization(RowRace);
  registerVisualization(LineRace);
  registerVisualization(Circle);
  registerVisualization(TreeMap);
  registerVisualization(DynamicPie);
  registerVisualization(Sunburst);
  registerVisualization(Rose);
  registerVisualization(NestedPies);
  registerVisualization(Bubble);
  registerVisualization(BarStack);
  registerVisualization(DoubleScalar);

  setDefaultVisualization(Table);
}
