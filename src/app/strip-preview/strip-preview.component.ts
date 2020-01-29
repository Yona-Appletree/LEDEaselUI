import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { LdTimeline, LdTimelineEntry } from "../model/engine/timeline";

@Component({
  selector: "ld-strip-preview",
  templateUrl: "./strip-preview.component.html",
  styleUrls: ["./strip-preview.component.scss"]
})
export class StripPreviewComponent implements OnInit, OnDestroy {
  @Input()
  timeline!: LdTimeline;

  @Input()
  ledCount = 48;

  @Output()
  frame = new EventEmitter<number>();

  pixelColors: string[] = [];

  running = true;

  get timeFrac() {
    return (Date.now() % this.timeline.durationMs) / this.timeline.durationMs;
  }

  constructor() { }

  ngOnInit() {
    this.update();
  }

  update() {
    if (this.running) {
      requestAnimationFrame(() => this.update());
    }

    if (! this.timeline) {
      return;
    }

    const time = this.timeFrac;

    this.frame.emit(time);

    this.pixelColors.length = this.ledCount;

    for (let i = 0; i < this.ledCount; i++) {
      const color = this.timeline.get(
        time,
        i / this.ledCount
      );

      this.pixelColors[i] = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }
  }

  ngOnDestroy(): void {
    this.running = false;
  }

  trackByFn(index: number, item: string) {
    return index;
  }
}
