import { map } from "rxjs/operators";

export class TimeContainer {

}

interface VisualFunction1D {
  apply(
    x: number,
    time: number
  ): RgbaColor;
}

interface ColorBandConfig {
  colorSource: ColorFunction;
  center: NumericFunction;
  colorShift: NumericFunction;
  alphaProfile: NumericFunction;
  width: NumericFunction;
  wrap: boolean;
  scaleColor: boolean;
}

export class ColorBandFunction {
  constructor(
    public config: ColorBandConfig
  ) {
  }

  apply(
    x: number,
    time: number
  ) {
    const config = this.config;

    const width = config.width.apply(time);

    const waveCenter = config.center.apply(time);

    const start = (waveCenter - width / 2);
    const end = (waveCenter + width / 2);

    if (config.wrap) {
      if (end > 1 &&  x < start && x < (end - 1)) {
        x += 1;
      }

      if (start < 0 && x > end && x > (start + 1)) {
        x -= 1;
      }
    }

    const mappedX = (x - start) / width;
    if (mappedX < 0 || mappedX > 1) {
      return BLACK;
    }

    return config.colorSource.apply(
      (config.scaleColor ? mappedX : x) + config.colorShift.apply(time)
    ).withAlpha(
      config.alphaProfile.apply(mappedX)
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

/**
 * Creates a polynomial triangle function, where powers higher than 1 smooth out the triangle.
 */
export class PolynomialTriangleFunction implements NumericFunction {
  constructor(
    public power: number = 1
  ) {
  }

  apply(x: number) {
    return 1 - Math.pow(Math.abs(x - .5) * 2, this.power);
  }
}

interface ColorFunction {
  apply(input: number): RgbaColor;
}

export class GradientFunction implements ColorFunction {
  constructor(
    public stops: GradientStop[]
  ) {
  }

  apply(input: number): RgbaColor {
    input = LedMath.sawtooth(input);

    for (let i = this.stops.length - 1; i >= 0; i--) {
      const stop = this.stops[i];

      if (input > stop.pos) {
        const next = this.stops[(i + 1) % this.stops.length];

        const x = LedMath.delerp(input, stop.pos, next.pos);

        return new RgbaColor(
          LedMath.lerp(x, stop.color.r, next.color.r),
          LedMath.lerp(x, stop.color.g, next.color.g),
          LedMath.lerp(x, stop.color.b, next.color.b)
        );
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
  color: RgbaColor;
}

export class RgbaColor {
  constructor(
    /** red (0-255) */
    public readonly r: number,
    /** green (0-255) */
    public readonly g: number,
    /** blue (0-255) */
    public readonly b: number,
    /** alpha (0-1) */
    public readonly a: number = 1.0,
  ) {}

  withR(r: number): RgbaColor {
    return new RgbaColor(r, this.g, this.b, this.a);
  }
  withG(g: number): RgbaColor {
    return new RgbaColor(this.r, g, this.b, this.a);
  }
  withB(b: number): RgbaColor {
    return new RgbaColor(this.r, this.g, b, this.a);
  }
  withAlpha(a: number): RgbaColor {
    return new RgbaColor(this.r, this.g, this.b, a);
  }
}

const BLACK = new RgbaColor(0, 0, 0);

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
