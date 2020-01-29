import { BaseLdEntity } from "./engine";
import { LdApiNumericConstant, LdApiSawtoothFunc, LdApiSineFunc, LdApiSquareFunc, LdApiTriangleFunc } from "../api/numericfunc";
import { LedMath } from "./util/math";
import { LdEntity } from "./factory";

export interface LdNumericFunc2 extends BaseLdEntity<any> {
  get(input: number, input2: number): number;
}

export interface LdNumericFunc1 extends LdNumericFunc2 {
  get(input: number): number;
}

export interface LdNumericFunc0 extends LdNumericFunc1 {
  get(): number;
}


@LdEntity()
export class LdNumericConstant extends BaseLdEntity<LdApiNumericConstant> implements LdNumericFunc0 {
  static idType: LdApiNumericConstant["type"] = "LdApiNumericConstant";

  get() {
    return this.apiModel.value;
  }
}

@LdEntity()
export class LdSineFunc extends BaseLdEntity<LdApiSineFunc> implements LdNumericFunc1 {
  static idType: LdApiSineFunc["type"] = "LdApiSineFunc";

  get(input: number) {
    const model = this.apiModel;
    return model.center
      + (model.outputShift + LedMath.sine((input + model.phaseShift) * model.iterations) * model.amplitude)
      - model.amplitude / 2;
  }
}

@LdEntity()
export class LdTriangleFunc extends BaseLdEntity<LdApiTriangleFunc> implements LdNumericFunc1 {
  static idType: LdApiTriangleFunc["type"] = "LdApiTriangleFunc";

  get(input: number) {
    const model = this.apiModel;
    return model.center
      + (model.outputShift + LedMath.triangle((input + model.phaseShift) * model.iterations, model.smoothing) * model.amplitude)
      - model.amplitude / 2;
  }
}

@LdEntity()
export class LdSawtoothFunc extends BaseLdEntity<LdApiSawtoothFunc> implements LdNumericFunc1 {
  static idType: LdApiSawtoothFunc["type"] = "LdApiSawtoothFunc";

  get(input: number) {
    const model = this.apiModel;
    return model.center
      + (model.outputShift + LedMath.sawtooth((input + model.phaseShift) * model.iterations) * model.amplitude)
      - model.amplitude / 2;
  }
}

@LdEntity()
export class LdSquareFunc extends BaseLdEntity<LdApiSquareFunc> implements LdNumericFunc1 {
  static idType: LdApiSquareFunc["type"] = "LdApiSquareFunc";

  get(input: number) {
    const model = this.apiModel;
    return model.center
      + (model.outputShift + LedMath.square((input + model.phaseShift) * model.iterations, model.dutyCycle) * model.amplitude)
      - model.amplitude / 2;
  }
}
