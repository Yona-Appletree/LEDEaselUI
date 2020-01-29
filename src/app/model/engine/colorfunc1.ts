import { LdColorFunction2 } from "./colorfunc2";
import { BaseLdEntity, LdEntity } from "./engine";
import { LdApiGradientColorFunc } from "../api/colorfunc1";
import { RgbaColor } from "./util/rgbacolor";
import { LedMath } from "./util/math";


const TOLERANCE = 1 / 256.0;

export interface LdColorFunction1 extends LdColorFunction2 {
  get(x: number): RgbaColor;
}

@LdEntity()
export class LdGradientColorFunc extends BaseLdEntity<LdApiGradientColorFunc> implements LdColorFunction1 {
  static idType: LdApiGradientColorFunc["type"] = "LdApiGradientColorFunc";

  get(input: number): RgbaColor {
    const stops = this.apiModel.stops;

    input = LedMath.sawtooth(input);

    for (let i = stops.length - 1; i >= 0; i--) {
      const stop = stops[i];

      if (input > stop.pos) {
        const next = stops[(i + 1) % stops.length];

        const x = LedMath.delerp(input, stop.pos, next.pos);

        const stopColor = RgbaColor.fromApi(stop.color);
        const nextColor = RgbaColor.fromApi(next.color);

        return new RgbaColor(
          LedMath.lerp(x, stopColor.r, nextColor.r),
          LedMath.lerp(x, stopColor.g, nextColor.g),
          LedMath.lerp(x, stopColor.b, nextColor.b)
        );
      }
    }

    if (input < stops[0].pos) {
      return RgbaColor.fromApi(stops[0].color);
    }

    return RgbaColor.fromApi(stops[stops.length - 1].color);
  }
}
