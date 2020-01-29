import { LdApiColor, LdApiDouble } from "./common";

type LdApiColorFunction1 = LdApiGradientColorFunc;

interface LdApiGradientColorFunc {
  type: "LdApiGradientColorFunc";

  stops: LdApiGradientColorFuncStop[];
}

interface LdApiGradientColorFuncStop {
  pos: LdApiDouble;
  color: LdApiColor;
}
