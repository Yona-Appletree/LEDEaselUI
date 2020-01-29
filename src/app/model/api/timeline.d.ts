import { LdApiDouble, LdApiIdentifiedEntity } from "./common";
import { LdApiColorFunction2 } from "./colorfunc2";

interface LdApiTimeline extends LdApiIdentifiedEntity {
  type: "LdApiTimeline";
  fixtureIds: string[];
  entries: LdApiTimelineEntry[];
}

interface LdApiTimelineEntry {
  type: "LdApiTimelineEntry";
  startMs: LdApiDouble;
  durationMs: LdApiDouble;
  function: LdApiColorFunction2;
}

