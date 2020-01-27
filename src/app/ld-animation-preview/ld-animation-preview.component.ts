import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ColorBandFunction } from "../model/model";

@Component({
  selector: "ld-animation-preview",
  templateUrl: "./ld-animation-preview.component.html",
  styleUrls: ["./ld-animation-preview.component.scss"]
})
export class LdAnimationPreviewComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  func!: ColorBandFunction;

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;

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
        const color = this.func.apply(y / height, x / width);

        context.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}
