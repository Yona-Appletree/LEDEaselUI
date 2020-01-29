import { LdApiColorFunction1 } from "./colorfunc1";
import { LdApiNumericFunc1 } from "./numericfunc";
import { LdApiTimeline, LdApiTimelineEntry } from "./timeline";

type LdApiColorFunction2
  = LdApiColorFunction1
  | LdApiCurvedColorBand
  | LdApiColorCompositionFunc2
  | LdApiTimeline
  | LdApiTimelineEntry
;

interface LdApiCurvedColorBand {
  type: "LdApiCurvedColorBand";

  colorSource: LdApiColorFunction2;
  colorShift: LdApiNumericFunc1;
  center: LdApiNumericFunc1;
  width: LdApiNumericFunc1;
  wrap: boolean;
  scaleColor: boolean;
}

interface LdApiColorCompositionFunc2 {
  type: "LdApiColorCompositionFunc2";

  stops: LdApiColorCompositionFunc2Stop[];
  easingFunc: LdApiNumericFunc1;
}

interface LdApiColorCompositionFunc2Stop {
  type: "LdApiColorCompositionFunc2Stop";

  pos: number;
  func: LdApiColorFunction1;
}
