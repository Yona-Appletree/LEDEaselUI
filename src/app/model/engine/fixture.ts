import { BaseLdEntity } from "./engine";
import { LdApiFixture, LdApiFixtureStrip } from "../api/fixture";
import { LdEntity } from "./factory";

export abstract class LdFixture<TModel extends LdApiFixture = LdApiFixture> extends BaseLdEntity<TModel> {}

@LdEntity()
export class LdFixtureStrip extends LdFixture<LdApiFixtureStrip> {
  static idType: LdApiFixtureStrip["type"] = "LdApiFixtureStrip";

}
