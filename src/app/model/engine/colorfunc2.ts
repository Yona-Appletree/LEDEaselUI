import { LdNumericFunc1 } from "./numericfunc";
import { LdApiColorCompositionFunc2, LdApiColorCompositionFunc2Stop, LdApiColorFunction2, LdApiCurvedColorBand } from "../api/colorfunc2";
import { BaseLdEntity } from "./engine";
import { LdApiColorFunction1, LdApiGradientColorFunc } from "../api/colorfunc1";
import { LdColorFunction1 } from "./colorfunc1";
import { LdApiNumericFunc1 } from "../api/numericfunc";
import { RgbaColor } from "./util/rgbacolor";
import { LedMath } from "./util/math";
import { LdEntity } from "./factory";

export interface LdColorFunction2 extends BaseLdEntity<any> {
  get(x: number, y: number): RgbaColor;
}

@LdEntity()
export class LdCurvedColorBand extends BaseLdEntity<LdApiCurvedColorBand> {
  static idType: LdApiCurvedColorBand["type"] = "LdApiCurvedColorBand";

  readonly colorSource = this.childEntity<LdApiColorFunction2, LdColorFunction2>(model => model.colorSource);
  readonly center = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.center);
  readonly width = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.width);

  get(
    x: number,
    time: number
  ) {
    const config = this.apiModel;

    const width = this.width.value.get(time);
    const waveCenter = this.center.value.get(time);

    const start = (waveCenter - width / 2);
    const end = (waveCenter + width / 2);

    let result = this.get0(x, time, start, width);

    if (config.wrap) {
      if (end > 1 && x < start && x < (end - 1)) {
        result = result.addBlendWith(
          this.get0(
            x + 1,
            time,
            start + 1,
            width
          )
        );
      }

      if (start < 0 && x > end && x > (start + 1)) {
        result = result.addBlendWith(
          this.get0(
            x - 1,
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
      this.apiModel.scaleColor ? mappedX : x,
      time
    );
  }
}


@LdEntity()
export class LdColorCompositionFunc2 extends BaseLdEntity<LdApiColorCompositionFunc2> {
  static idType: LdApiColorCompositionFunc2["type"] = "LdApiColorCompositionFunc2";

  readonly easingFunc = this.childEntity<LdApiNumericFunc1, LdNumericFunc1>(model => model.easingFunc);
  readonly stops = this.entityArray<LdApiColorCompositionFunc2Stop, LdColorCompositionFunc2Stop>(model => model.stops);

  get(input1: number, input2: number): RgbaColor {
    input1 = LedMath.sawtooth(input1);

    for (let i = this.stops.length - 1; i >= 0; i--) {
      const curStop = this.stops[i];

      if (input1 > curStop.pos) {
        const nextStop = this.stops[(i + 1) % this.stops.length];

        const scaledX = this.easingFunc.value.get(
          LedMath.delerp(input1, curStop.pos, nextStop.pos)
        );

        if (scaledX < RgbaColor.TOLERANCE) {
          return curStop.func.value.get(input2);
        }

        if (scaledX > 1 - RgbaColor.TOLERANCE) {
          return nextStop.func.value.get(input2);
        }

        const colorA = curStop.func.value.get(input2);
        const colorB = nextStop.func.value.get(input2);

        return colorA.lerpTo(scaledX, colorB);
      }
    }

    if (input1 < this.stops[0].pos) {
      return this.stops[0].func.value.get(input2);
    }

    return this.stops[this.stops.length - 1].func.value.get(input2);
  }
}

export class LdColorCompositionFunc2Stop extends BaseLdEntity<LdApiColorCompositionFunc2Stop> {
  get pos() {
    return this.apiModel.pos;
  }

  func = this.childEntity<LdApiColorFunction1, LdColorFunction1>(model => model.func);
}
