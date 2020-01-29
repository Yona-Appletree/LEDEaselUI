import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { LdTimelineEntry } from "../model/engine/timeline";

@Component({
  selector: "ld-strip-preview",
  templateUrl: "./strip-preview.component.html",
  styleUrls: ["./strip-preview.component.scss"]
})
export class StripPreviewComponent implements OnInit, OnDestroy {
  @Input()
  entry!: LdTimelineEntry;

  @Input()
  ledCount = 48;

  @Output()
  frame = new EventEmitter<number>();

  pixelColors: string[] = [];

  running = true;

  get timeFrac() {
    return (Date.now() % this.entry.durationMs) / this.entry.durationMs;
  }

  constructor() { }

  ngOnInit() {
    this.update();
  }

  update() {
    if (this.running) {
      requestAnimationFrame(() => this.update());
    }

    if (! this.entry) {
      return;
    }

    const time = this.timeFrac;

    this.frame.emit(time);

    this.pixelColors.length = this.ledCount;

    for (let i = 0; i < this.ledCount; i++) {
      const color = this.entry.function.value.get(
        i / this.ledCount,
        time
      );

      this.pixelColors[i] = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }
  }

  ngOnDestroy(): void {
    this.running = false;
  }
}
