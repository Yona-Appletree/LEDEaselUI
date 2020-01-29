import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { LdColorFunction2 } from "../model/engine/colorfunc2";

@Component({
  selector: "ld-colorfunc2-preview",
  templateUrl: "ld-colorfunc2-preview.component.html",
  styleUrls: ["./ld-colorfunc2-preview.component.scss"]
})
export class LdColorFunc2PreviewComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  func!: LdColorFunction2;

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;

  @Input()
  width = 128;

  @Input()
  height = 32;

  @Input()
  timeIndicatorPos: number | null = null;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  ngAfterViewInit(): void {
    this.update();
  }

  update() {
    if (!this.canvas || !this.func) {
      return;
    }

    const context = this.canvas.nativeElement.getContext("2d");

    if (!context) {
      return;
    }

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const color = this.func.get(x / width, y / height);

        context.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}
