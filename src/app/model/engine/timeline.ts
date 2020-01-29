import { BaseLdEntity } from "./engine";
import { LdApiTimeline, LdApiTimelineEntry } from "../api/timeline";
import { LdApiColorFunction2 } from "../api/colorfunc2";
import { LdColorFunction2 } from "./colorfunc2";
import { LdEntity } from "./factory";

@LdEntity()
export class LdTimeline extends BaseLdEntity<LdApiTimeline> {
  static idType: LdApiTimeline["type"] = "LdApiTimeline";

  readonly entries = this.entityArray<LdApiTimelineEntry, LdTimelineEntry>(model => model.entries);
}

@LdEntity()
export class LdTimelineEntry extends BaseLdEntity<LdApiTimelineEntry> {
  static idType: LdApiTimelineEntry["type"] = "LdApiTimelineEntry";

  readonly function = this.childEntity<LdApiColorFunction2, LdColorFunction2>(model => model.function);

  get startMs() { return this.apiModel.startMs; }
  get durationMs() { return this.apiModel.durationMs; }
}
