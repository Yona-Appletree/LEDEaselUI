import { LdApiDouble } from "./common";

type LdApiNumericFunc0 = LdApiNumericConstant;

interface LdApiNumericConstant {
  type: "LdApiNumericConstant";
  value: LdApiDouble;
}

type LdApiNumericFunc1 = LdApiNumericFunc0 | LdApiSineFunc | LdApiTriangleFunc | LdApiSawtoothFunc | LdApiSquareFunc;

interface LdApiWaveFunc {
  center: LdApiDouble;
  amplitude: LdApiDouble;
  phaseShift: LdApiDouble;
  iterations: LdApiDouble;
  outputShift: LdApiDouble;
}

interface LdApiSineFunc extends LdApiWaveFunc {
  type: "LdApiSineFunc";
}


interface LdApiTriangleFunc extends LdApiWaveFunc {
  type: "LdApiTriangleFunc";

  smoothing: LdApiDouble;
}


interface LdApiSawtoothFunc extends LdApiWaveFunc {
  type: "LdApiSawtoothFunc";
}


interface LdApiSquareFunc extends LdApiWaveFunc {
  type: "LdApiSquareFunc";

  dutyCycle: LdApiDouble;
}
