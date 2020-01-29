import { Component } from "@angular/core";
import { LdApiScene } from "./model/api/scene";
import { LdEngine } from "./model/engine/engine";
import { LdScene } from "./model/engine/scene";
import { RgbaColor } from "./model/engine/util/rgbacolor";
import { updateOrReplaceEntity } from "./model/engine/factory";




import "./model/engine/colorfunc1";
import "./model/engine/colorfunc2";
import "./model/engine/fixture";
import "./model/engine/numericfunc";
import "./model/engine/output";
import "./model/engine/scene";
import "./model/engine/timeline";


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
            durationMs: 5000,
            startMs: 0,
            function: {
              type: "LdApiCurvedColorBand",
              colorSource: {
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
              },
              center: {
                type: "LdApiSineFunc",
                center: .5,
                amplitude: 1,
                phaseShift: 0,
                outputShift: 0,
                iterations: 1.0
              },
              width: {
                type: "LdApiSineFunc",
                center: .5,
                amplitude: .5,
                iterations: .5,
                phaseShift: 0,
                outputShift: 0,
              },
              wrap: true,
              scaleColor: true,
            }
          }
        ]
      }
    ]
  };

  engine = new LdEngine();

  scene = updateOrReplaceEntity<LdApiScene, LdScene>(this.engine, null, this.config);
  entry = Array.from(this.scene.timelines.values())[0].entries[0];

  updateModel() {
    this.scene = updateOrReplaceEntity<LdApiScene, LdScene>(this.engine, this.scene, this.config);
  }
}
