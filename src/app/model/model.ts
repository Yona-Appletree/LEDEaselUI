import { map } from "rxjs/operators";

export class TimeContainer {

}

interface VisualFunction1D {
  apply(
    x: number,
    time: number
  ): RgbColor;
}

export class ColorBandFunction {
  constructor(
    public colorSource: ColorFunction,
    public center: NumericFunction,
    public colorShift: NumericFunction,
    public width: NumericFunction,
    public wrap: boolean,
    public scaleColor: boolean
  ) {
  }

  apply(
    x: number,
    time: number
  ) {
    const width = this.width.apply(time);

    const waveCenter = this.center.apply(time);

    const start = (waveCenter - width / 2);
    const end = (waveCenter + width / 2);

    if (this.wrap) {
      if (end > 1 && x < (end - 1)) {
        x += 1;
      }

      if (start < 0 && x > (start + 1)) {
        x -= 1;
      }
    }

    const mappedX = (x - start) / width;
    if (mappedX < 0 || mappedX > 1) {
      return BLACK;
    }

    return this.colorSource.apply(
      (this.scaleColor ? mappedX : x) + this.colorShift.apply(time)
    );
  }
}


interface NumericFunction {
  apply(input: number): number;
}

export class NumericConstant implements NumericFunction {
  constructor(
    public value: number
  ) {}

  apply(input: number) {
    return this.value;
  }
}

export function constant(input: number) {
  return new NumericConstant(input);
}

export class WaveFunction implements NumericFunction {
  constructor(
    public type: WaveType,
    public center: number,
    public amplitude: number,
    public iterations: number,
    public xShift: number = 0,
    public yShift: number = 0
  ) {
  }

  apply(input: number) {
    return this.center
      + (this.yShift + LedMath.waves[this.type]((input + this.xShift) * this.iterations) * this.amplitude) - this.amplitude / 2;
  }
}


interface ColorFunction {
  apply(input: number): RgbColor;
}

export class GradientFunction implements ColorFunction {
  constructor(
    public stops: GradientStop[]
  ) {
  }

  apply(input: number): RgbColor {
    input = LedMath.sawtooth(input);

    for (let i = this.stops.length - 1; i >= 0; i--) {
      const stop = this.stops[i];

      if (input > stop.pos) {
        const next = this.stops[(i + 1) % this.stops.length];

        const x = LedMath.delerp(input, stop.pos, next.pos);

        return {
          r: LedMath.lerp(x, stop.color.r, next.color.r),
          g: LedMath.lerp(x, stop.color.g, next.color.g),
          b: LedMath.lerp(x, stop.color.b, next.color.b),
        };
      }
    }

    if (input < this.stops[0].pos) {
      return this.stops[0].color;
    }
    return this.stops[this.stops.length - 1].color;
  }
}

interface GradientStop {
  pos: number;
  color: RgbColor;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const BLACK = {r: 0, g: 0, b: 0};

/**
 * Led math helpers. Pretty much a bunch of math functions based on normalized (0-1) input and output
 */
export class LedMath {
  static waves: { [K in WaveType]: (x: number) => number } = {
    sawtooth: LedMath.sawtooth,
    sine: LedMath.sine,
    triangle: LedMath.triangle,
    square: LedMath.square,
  };

  static sawtooth(x: number) {
    let v = x % 1.0;
    if (v < 0) {
      v += 1.0;
    }
    return v;
  }

  static sine(x: number) {
    return (1 + Math.sin(x * Math.PI * 2)) / 2;
  }

  static triangle(x: number) {
    x = LedMath.sawtooth(x);

    if (x < 0.5) {
      return x * 2;
    } else {
      return 1 - (x - .5) * 2;
    }
  }

  static square(x: number) {
    x = LedMath.sawtooth(x);

    return x < 0.5 ? 0 : 1;
  }

  static clamp(
    x: number,
    min = 0.0,
    max = 1.0
  ) {
    if (x < min) {
      return min;
    }
    if (x > max) {
      return max;
    }
    return x;
  }

  static lerp(
    x: number,
    start: number,
    end: number
  ) {
    return start + (end - start) * x;
  }

  static delerp(
    x: number,
    start: number,
    end: number
  ) {
    return (x - start) / (end - start);
  }

  static map(
    x: number,
    inStart: number,
    inEnd: number,
    outStart: number,
    outEnd: number,
  ) {
    return LedMath.lerp(
      LedMath.delerp(x, inStart, inEnd),
      outStart,
      outEnd
    );
  }
}

type WaveType = "sawtooth" | "sine" | "triangle" | "square";
