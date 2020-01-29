import { LdApiColorCompositionFunc2Stop, LdApiColorFunction2 } from "./colorfunc2";
import { LdApiTimeline, LdApiTimelineEntry } from "./timeline";
import { LdApiScene } from "./scene";
import { LdApiOutput } from "./output";
import { LdApiNumericFunc0, LdApiNumericFunc1 } from "./numericfunc";
import { LdApiFixture } from "./fixture";
import { LdApiColorFunction1 } from "./colorfunc1";

export type LdApiEntity
  = LdApiColorFunction1
  | LdApiColorFunction2
  | LdApiFixture
  | LdApiNumericFunc0
  | LdApiNumericFunc1
  | LdApiOutput
  | LdApiScene
  | LdApiTimeline
  | LdApiTimelineEntry
  | LdApiColorCompositionFunc2Stop
;
