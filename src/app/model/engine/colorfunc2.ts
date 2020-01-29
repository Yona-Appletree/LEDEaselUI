import { LdNumericFunc1 } from "./numericfunc";
import { LdApiColorCompositionFunc2, LdApiColorCompositionFunc2Stop, LdApiColorFunction2, LdApiCurvedColorBand } from "../api/colorfunc2";
import { BaseLdEntity, LdEntity } from "./engine";
import { LdApiColorFunction1, LdApiGradientColorFunc } from "../api/colorfunc1";
import { LdColorFunction1 } from "./colorfunc1";
import { LdApiNumericFunc1 } from "../api/numericfunc";
import { RgbaColor } from "./util/rgbacolor";
import { LedMath } from "./util/math";


export interface LdColorFunction2 extends BaseLdEntity<any> {
  get(x: number, y: number): RgbaColor;
}

@LdEntity()
export class LdCurvedColorBand extends BaseLdEntity<LdApiCurvedColorBand> {
  static idType: LdApiCurvedColorBand["type"] = "LdApiCurvedColorBand";

  readonly colorSource = this.childEntity<LdApiColorFunction2, LdColorFunction2>(model => model.colorSource);

  readonly center = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.center);
  readonly width = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.width);
  readonly colorShift = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.colorShift);

  get(
    time: number,
    pos: number
  ) {
    const config = this.apiModel;

    const width = this.width.value.get(time);
    const waveCenter = this.center.value.get(time);

    const start = (waveCenter - width / 2);
    const end = (waveCenter + width / 2);

    let result = this.get0(pos, time, start, width);

    if (config.wrap) {
      if (end > 1 && pos < start && pos < (end - 1)) {
        result = result.addBlendWith(
          this.get0(
            pos + 1,
            time,
            start + 1,
            width
          )
        );
      }

      if (start < 0 && pos > end && pos > (start + 1)) {
        result = result.addBlendWith(
          this.get0(
            pos - 1,
            time,
            start - 1,
            width
          )
        );
      }
    }

    return result;
  }

  private get0(
    x: number,
    time: number,
    start: number,
    width: number
  ) {
    const mappedX = (x - start) / width;
    if (mappedX < 0 || mappedX > 1) {
      return RgbaColor.BLACK;
    }

    return this.colorSource.value.get(
      time,
      (this.apiModel.scaleColor ? mappedX : x) + this.colorShift.value.get(time)
    );
  }
}


@LdEntity()
export class LdColorCompositionFunc2 extends BaseLdEntity<LdApiColorCompositionFunc2> {
  static idType: LdApiColorCompositionFunc2["type"] = "LdApiColorCompositionFunc2";

  readonly easingFunc = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.easingFunc);
  readonly stops = this.entityArray<LdApiColorCompositionFunc2Stop, LdColorCompositionFunc2Stop>(model => model.stops);

  get(
    time: number,
    pos: number
  ): RgbaColor {
    time = LedMath.sawtooth(time);

    if (time < this.stops[0].pos || this.stops.length === 1) {
      return this.stops[0].func.value.get(pos);
    }

    for (let i = this.stops.length - 1; i >= 0; i--) {
      const curStop = this.stops[i];

      if (time > curStop.pos) {
        const nextStop = this.stops[(i + 1) % this.stops.length];

        const scaledX = this.easingFunc.value.get(
          LedMath.delerp(time, curStop.pos, nextStop.pos)
        );

        if (scaledX < RgbaColor.TOLERANCE) {
          return curStop.func.value.get(pos);
        }

        if (scaledX > 1 - RgbaColor.TOLERANCE) {
          return nextStop.func.value.get(pos);
        }

        const colorA = curStop.func.value.get(pos);
        const colorB = nextStop.func.value.get(pos);

        return colorA.lerpTo(scaledX, colorB);
      }
    }

    return this.stops[0].func.value.get(pos);
  }
}

@LdEntity()
export class LdColorCompositionFunc2Stop extends BaseLdEntity<LdApiColorCompositionFunc2Stop> {
  static idType: LdApiColorCompositionFunc2Stop["type"] = "LdApiColorCompositionFunc2Stop";

  get pos() {
    return this.apiModel.pos;
  }

  func = this.childEntity<LdApiColorFunction1, LdColorFunction1>(model => model.func);
}
