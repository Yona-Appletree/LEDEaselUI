import { Component, Input, OnInit } from "@angular/core";
import { LdTimeline } from "../model/engine/timeline";

@Component({
  selector: "ld-timeline-editor",
  templateUrl: "./timeline-editor.component.html",
  styleUrls: ["./timeline-editor.component.scss"]
})
export class TimelineEditorComponent implements OnInit {
  @Input()
  timeline!: LdTimeline;

  @Input()
  timeIndicatorPos: number | null = null;

  pixelsPerMs = 0.1;

  constructor() { }

  ngOnInit() {
  }

  timeToPx(timeMs: number) {
    return timeMs * this.pixelsPerMs;
  }
}
