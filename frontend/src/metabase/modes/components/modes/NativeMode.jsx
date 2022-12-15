import NativeDrillFallback from "../drill/NativeDrillFallback";
import DefaultMode from "./DefaultMode";

const NativeMode = {
  name: "native",
  drills: DefaultMode.drills,
  fallback: [],
  // fallback: NativeDrillFallback,
};

export default NativeMode;
