import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ColorBandFunction } from "../model/model";

@Component({
  selector: "ld-strip-preview",
  templateUrl: "./strip-preview.component.html",
  styleUrls: ["./strip-preview.component.scss"]
})
export class StripPreviewComponent implements OnInit, OnDestroy {
  @Input()
  func!: ColorBandFunction;

  @Input()
  ledCount = 48;

  @Input()
  durationMs = 5000;

  pixelColors: string[] = [];

  running = true;

  constructor() { }

  ngOnInit() {
    this.update();
  }

  update() {
    if (this.running) {
      requestAnimationFrame(() => this.update());
    }

    if (! this.func) {
      return;
    }

    const time = (Date.now() % this.durationMs) / this.durationMs;

    this.pixelColors.length = this.ledCount;

    for (let i = 0; i < this.ledCount; i++) {
      const color = this.func.apply(
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
