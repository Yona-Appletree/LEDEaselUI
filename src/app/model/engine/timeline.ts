import { BaseLdEntity, LdComputed, LdEntity } from "./engine";
import { LdApiTimeline, LdApiTimelineEntry } from "../api/timeline";
import { LdApiColorFunction2 } from "../api/colorfunc2";
import { LdColorFunction2 } from "./colorfunc2";
import { RgbaColor } from "./util/rgbacolor";
import { LedMath } from "./util/math";
import { max } from "rxjs/operators";


@LdEntity()
export class LdTimeline extends BaseLdEntity<LdApiTimeline> implements LdColorFunction2 {
  static idType: LdApiTimeline["type"] = "LdApiTimeline";

  readonly entries = this.entityArray<LdApiTimelineEntry, LdTimelineEntry>(model => model.entries);

  @LdComputed()
  get durationMs() {
    let latestEndMs = 0;
    for (const entry of this.entries) {
      latestEndMs = Math.max(entry.endMs, latestEndMs);
    }
    return latestEndMs;
  }

  @LdComputed()
  get rows() {
    const rows: LdTimelineEntry[][] = [];

    for (const entry of this.entries) {
      const row = rows.find(
        currentRow => ! currentRow.find(rowEntry => rowEntry.overlaps(entry))
      ) || (() => {
        const newRow: LdTimelineEntry[] = [];
        rows.push(newRow);
        return newRow;
      })();

      row.push(entry);
    }

    return rows;
  }

  colorFor(timeMs: number, pos: number) {
    let result = RgbaColor.BLACK;

    for (const entry of this.entries) {
      result = result.addBlendWith(entry.colorForTimelineTime(timeMs, pos));
    }

    return result;
  }

  get(x: number, y: number): RgbaColor {
    return this.colorFor(x * this.durationMs, y);
  }
}

@LdEntity()
export class LdTimelineEntry extends BaseLdEntity<LdApiTimelineEntry> implements LdColorFunction2 {
  static idType: LdApiTimelineEntry["type"] = "LdApiTimelineEntry";

  readonly function = this.childEntity<LdApiColorFunction2, LdColorFunction2>(model => model.function);

  get startMs() {
    return this.apiModel.startMs;
  }

  get durationMs() {
    return this.apiModel.durationMs;
  }

  get endMs() {
    return this.startMs + this.durationMs;
  }

  colorForTimelineTime(
    timeMs: number,
    pos: number
  ) {
    if (timeMs < this.startMs || timeMs >= this.endMs) {
      return RgbaColor.TRANSPARENT;
    }

    return this.function.value.get(
      LedMath.delerp(timeMs, this.startMs, this.endMs),
      pos
    );
  }

  get(x: number, y: number): RgbaColor {
    return this.function.value.get(
      x,
      y
    );
  }

  includesTime(timeMs: number) {
    return timeMs >= this.startMs && timeMs < this.endMs;
  }

  overlaps(other: LdTimelineEntry) {
    return this.includesTime(other.startMs) || this.includesTime(other.endMs);
  }
}
