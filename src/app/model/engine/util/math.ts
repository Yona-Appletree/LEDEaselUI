

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

  static triangle(
    x: number,
    smoothingPower = 1
  ) {
    x = LedMath.sawtooth(x);
    return 1 - Math.pow(Math.abs(x - .5) * 2, smoothingPower);
  }

  static square(
    x: number,
    duty = 0.5
  ) {
    x = LedMath.sawtooth(x);

    return x < duty ? 0 : 1;
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

export type WaveType = "sawtooth" | "sine" | "triangle" | "square";
