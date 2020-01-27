import { Component } from "@angular/core";
import { GradientFunction, ColorBandFunction, WaveFunction, constant, PolynomialTriangleFunction, RgbaColor } from "./model/model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "ledeasel";

  config = {
    colorSource: new GradientFunction([
      {pos: 0 / 255.0,   color: new RgbaColor(255, 0, 0)},
      {pos: 7 / 255.0,   color: new RgbaColor(255, 0, 0)},
      {pos: 33 / 255.0,  color: new RgbaColor(255, 255, 0)},
      {pos: 61 / 255.0,  color: new RgbaColor(255, 255, 0)},
      {pos: 81 / 255.0,  color: new RgbaColor(0, 255, 0)},
      {pos: 99 / 255.0,  color: new RgbaColor(0, 255, 0)},
      {pos: 119 / 255.0, color: new RgbaColor(0, 255, 255)},
      {pos: 137 / 255.0, color: new RgbaColor(0, 255, 255)},
      {pos: 163 / 255.0, color: new RgbaColor(0, 0, 255)},
      {pos: 173 / 255.0, color: new RgbaColor(0, 0, 255)},
      {pos: 204 / 255.0, color: new RgbaColor(255, 0, 255)},
      {pos: 216 / 255.0, color: new RgbaColor(255, 0, 255)},
      {pos: 247 / 255.0, color: new RgbaColor(255, 0, 0)},
      {pos: 255 / 255.0, color: new RgbaColor(255, 0, 0)},
      {pos: 255 / 255.0, color: new RgbaColor(255, 0, 0)},
    ]),
    center: new WaveFunction(
      "sine",
      .5,
      .7,
      1
    ),
    colorShift: new WaveFunction(
      "sine",
      .5,
      .5,
      1
    ),
    alphaProfile: new PolynomialTriangleFunction(
      3
    ),
    width: new WaveFunction(
      "sine",
      .5,
      .5,
      .5
    ),
    wrap: true,
    scaleColor: true,
  };

  testFunc = new ColorBandFunction(this.config);
}
