import { LdApiColorFunction1 } from "./colorfunc1";
import { LdApiNumericFunc1 } from "./numericfunc";

type LdApiColorFunction2 = LdApiColorFunction1 | LdApiCurvedColorBand | LdApiColorCompositionFunc2;

interface LdApiCurvedColorBand {
  type: "LdApiCurvedColorBand";

  colorSource: LdApiColorFunction2;
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
