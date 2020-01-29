import { Component } from "@angular/core";
import { LdApiScene } from "./model/api/scene";
import { BaseLdEntity, LdEngine } from "./model/engine/engine";
import { LdScene } from "./model/engine/scene";
import { RgbaColor } from "./model/engine/util/rgbacolor";

import "./model/engine/colorfunc1";
import "./model/engine/colorfunc2";
import "./model/engine/fixture";
import "./model/engine/numericfunc";
import "./model/engine/output";
import "./model/engine/scene";
import "./model/engine/timeline";
import { LdApiNumericConstant, LdApiSineFunc, LdApiTriangleFunc } from "./model/api/numericfunc";
import { LdApiColorFunction1, LdApiGradientColorFunc } from "./model/api/colorfunc1";

const rainbowGradient = {
  type: "LdApiGradientColorFunc",
  stops: [
    {pos: 0 / 255.0,   color: RgbaColor.toApi(255, 0, 0)},
    {pos: 7 / 255.0,   color: RgbaColor.toApi(255, 0, 0)},
    {pos: 33 / 255.0,  color: RgbaColor.toApi(255, 255, 0)},
    {pos: 61 / 255.0,  color: RgbaColor.toApi(255, 255, 0)},
    {pos: 81 / 255.0,  color: RgbaColor.toApi(0, 255, 0)},
    {pos: 99 / 255.0,  color: RgbaColor.toApi(0, 255, 0)},
    {pos: 119 / 255.0, color: RgbaColor.toApi(0, 255, 255)},
    {pos: 137 / 255.0, color: RgbaColor.toApi(0, 255, 255)},
    {pos: 163 / 255.0, color: RgbaColor.toApi(0, 0, 255)},
    {pos: 173 / 255.0, color: RgbaColor.toApi(0, 0, 255)},
    {pos: 204 / 255.0, color: RgbaColor.toApi(255, 0, 255)},
    {pos: 216 / 255.0, color: RgbaColor.toApi(255, 0, 255)},
    {pos: 247 / 255.0, color: RgbaColor.toApi(255, 0, 0)},
    {pos: 255 / 255.0, color: RgbaColor.toApi(255, 0, 0)},
    {pos: 255 / 255.0, color: RgbaColor.toApi(255, 0, 0)},
  ]
} as LdApiGradientColorFunc;


const testGradient = {
  type: "LdApiGradientColorFunc",
  stops: [
    {pos: 0.0, color: RgbaColor.toApi(255, 0, 0)},
    {pos: 0.5, color: RgbaColor.toApi(255, 128, 0)},
  ]
} as LdApiGradientColorFunc;

const testGradient2 = {
  type: "LdApiGradientColorFunc",
  stops: [
    {pos: 0.0, color: RgbaColor.toApi(55, 0, 255)},
    {pos: 0.5, color: RgbaColor.toApi(0, 0, 255)},
  ]
} as LdApiGradientColorFunc;


function constant(value: number) {
  return {
    type: "LdApiNumericConstant",
    value
  } as LdApiNumericConstant;
}

function sineWave(
  {
    center = .5,
    amplitude = 1,
    phaseShift = 0,
    outputShift = 0,
    iterations = 1.0
  } = {}
) {
  return {
    type: "LdApiSineFunc",
    center,
    amplitude,
    phaseShift,
    outputShift,
    iterations,
  } as LdApiSineFunc;
}


function triangleWave(
  {
    center = .5,
    amplitude = 1,
    phaseShift = 0,
    outputShift = 0,
    iterations = 1.0,
    smoothing = 1.0
  } = {}
) {
  return {
    type: "LdApiTriangleFunc",
    center,
    amplitude,
    phaseShift,
    outputShift,
    iterations,
    smoothing
  } as LdApiTriangleFunc;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "ledeasel";

  config: LdApiScene = {
    type: "LdApiScene",
    fixtures: [],
    outputs: [],
    timelines: [
      {
        type: "LdApiTimeline",
        uuid: "123",
        fixtureIds: [],
        entries: [
          {
            type: "LdApiTimelineEntry",
            startMs: 0,
            durationMs: 5000,
            function: {
              type: "LdApiCurvedColorBand",
              colorSource: {
                type: "LdApiColorCompositionFunc2",
                stops: [
                  {
                    type: "LdApiColorCompositionFunc2Stop",
                    pos: 0,
                    func: rainbowGradient,
                  }
                ],
                easingFunc: triangleWave()
              },
              center: sineWave(),
              width: sineWave({ center: 0, iterations: .5, amplitude: 1.5 }),
              wrap: true,
              scaleColor: true,
              colorShift: constant(1.0),
            }
          },
          {
            type: "LdApiTimelineEntry",
            startMs: 7000,
            durationMs: 4000,
            function: {
              type: "LdApiCurvedColorBand",
              colorSource: {
                type: "LdApiColorCompositionFunc2",
                stops: [
                  {
                    type: "LdApiColorCompositionFunc2Stop",
                    pos: 0,
                    func: rainbowGradient,
                  },
                  {
                    type: "LdApiColorCompositionFunc2Stop",
                    pos: 1,
                    func: testGradient2,
                  }
                ],
                easingFunc: triangleWave()
              },
              center: constant(0.5),
              width: sineWave({ center: .6, amplitude: .2}),
              colorShift: constant(1.0),
              wrap: true,
              scaleColor: true,
            }
          },
          {
            type: "LdApiTimelineEntry",
            startMs: 1000,
            durationMs: 12000,
            function: {
              type: "LdApiCurvedColorBand",
              colorSource: testGradient2,
              center: triangleWave({ smoothing: 3 }),
              width: sineWave({ iterations: 2, amplitude: .75 }),
              wrap: true,
              scaleColor: true,
              colorShift: sineWave(),
            },
          }
        ]
      }
    ]
  };

  engine = new LdEngine();

  scene: LdScene = BaseLdEntity.updateOrReplaceEntity<LdApiScene, LdScene>(this.engine, null, this.config);

  updateModel() {
    this.scene = BaseLdEntity.updateOrReplaceEntity<LdApiScene, LdScene>(this.engine, this.scene, this.config);
  }
}
