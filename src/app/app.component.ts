import { Component } from "@angular/core";
import { GradientFunction, ColorBandFunction, WaveFunction, constant } from "./model/model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "ledeasel";

  testFunc = new ColorBandFunction(
    new GradientFunction([
      { pos:   0 / 255.0, color: { r: 255, g:   0, b:   0 } },
      { pos:   7 / 255.0, color: { r: 255, g:   0, b:   0 } },
      { pos:  33 / 255.0, color: { r: 255, g: 255, b:   0 } },
      { pos:  61 / 255.0, color: { r: 255, g: 255, b:   0 } },
      { pos:  81 / 255.0, color: { r:   0, g: 255, b:   0 } },
      { pos:  99 / 255.0, color: { r:   0, g: 255, b:   0 } },
      { pos: 119 / 255.0, color: { r:   0, g: 255, b: 255 } },
      { pos: 137 / 255.0, color: { r:   0, g: 255, b: 255 } },
      { pos: 163 / 255.0, color: { r:   0, g:   0, b: 255 } },
      { pos: 173 / 255.0, color: { r:   0, g:   0, b: 255 } },
      { pos: 204 / 255.0, color: { r: 255, g:   0, b: 255 } },
      { pos: 216 / 255.0, color: { r: 255, g:   0, b: 255 } },
      { pos: 247 / 255.0, color: { r: 255, g:   0, b:   0 } },
      { pos: 255 / 255.0, color: { r: 255, g:   0, b:   0 } },
      { pos: 255 / 255.0, color: { r: 255, g:   0, b:   0 } },
    ]),
    new WaveFunction(
      "sine",
      0.5,
      .5,
      2
    ),
    new WaveFunction(
      "sine",
      0.5,
      .1,
      2
    ),
    new WaveFunction(
      "sine",
      .6,
      .4,
      1
    ),
    true,
    false
  );
}
