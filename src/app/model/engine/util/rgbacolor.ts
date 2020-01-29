/* tslint:disable:no-bitwise */
import { LedMath } from "./math";
import { LdApiColor } from "../../api/common";

export class RgbaColor {
  static BLACK = new RgbaColor(0, 0, 0);
  static TRANSPARENT = new RgbaColor(0, 0, 0, 0);

  static TOLERANCE = 1.0 / 256;

  static fromApi(color: LdApiColor) {
    return new RgbaColor(
      (color >> 24) & 0xFF,
      (color >> 16) & 0xFF,
      (color >> 8) & 0xFF,
      ((color >> 0) & 0xFF) / 255.0,
    );
  }

  static toApi(
    /** red (0-255) */
    r: number,
    /** green (0-255) */
    g: number,
    /** blue (0-255) */
    b: number,
    /** alpha (0-1) */
    a: number = 1.0,
  ) {
    return ((r & 0xFF) << 24)
      | ((g & 0xFF) << 16)
      | ((b & 0xFF) << 8)
      | (((a * 255) & 0xFF) << 0);
  }

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

  get cssColor() {
    const value = this.a > 1 - RgbaColor.TOLERANCE
      ? `rgb(${this.r},${this.g},${this.b})`
      : `rgba(${this.r},${this.g},${this.b},${this.a * 100}%)`;

    Object.defineProperty(this, "cssColor", { value });

    return value;
  }

  get apiColor() {
    const value = RgbaColor.toApi(this.r, this.g, this.b, this.a);

    Object.defineProperty(this, "apiColor", { value });

    return value;
  }

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

  lerpTo(x: number, other: RgbaColor) {
    return new RgbaColor(
      LedMath.lerp(x, this.r, other.r),
      LedMath.lerp(x, this.g, other.g),
      LedMath.lerp(x, this.b, other.b),
      LedMath.lerp(x, this.a, other.a),
    );
  }

  alphaBlendWith(other: RgbaColor) {
    // From https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
    return new RgbaColor(
      LedMath.clamp(other.r * other.a + this.r * this.a * (1 - other.a), 0, 255),
      LedMath.clamp(other.g * other.a + this.g * this.a * (1 - other.a), 0, 255),
      LedMath.clamp(other.b * other.a + this.b * this.a * (1 - other.a), 0, 255),
      LedMath.clamp(other.a + this.a * (1 - other.a), 0, 1.0),
    );
  }

  addBlendWith(other: RgbaColor) {
    return new RgbaColor(
      LedMath.clamp(other.r * other.a + this.r * this.a, 0, 255),
      LedMath.clamp(other.g * other.a + this.g * this.a, 0, 255),
      LedMath.clamp(other.b * other.a + this.b * this.a, 0, 255),
      LedMath.clamp(other.a + this.a, 0, 1.0),
    );
  }
}
