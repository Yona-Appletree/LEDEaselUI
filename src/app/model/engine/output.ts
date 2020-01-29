import { BaseLdEntity, LdEntity } from "./engine";
import { LdApiOutput, LdApiOutputArtnet, LdApiOutputFastled } from "../api/output";


export abstract class LdOutput<TModel extends LdApiOutput = LdApiOutput> extends BaseLdEntity<TModel> {}

@LdEntity()
export class LdOutputFastled extends LdOutput<LdApiOutputFastled> {
  static idType: LdApiOutputFastled["type"] = "LdApiOutputFastled";

}

@LdEntity()
export class LdOutputArtnet extends LdOutput<LdApiOutputArtnet> {
  static idType: LdApiOutputArtnet["type"] = "LdApiOutputArtnet";

}
