import { LdApiScene } from "../api/scene";
import { BaseLdEntity } from "./engine";
import { LdApiTimeline } from "../api/timeline";
import { LdApiFixture } from "../api/fixture";
import { LdApiOutput } from "../api/output";
import { LdTimeline } from "./timeline";
import { LdOutput } from "./output";
import { LdFixture } from "./fixture";
import { LdEntity } from "./factory";


@LdEntity()
export class LdScene extends BaseLdEntity<LdApiScene> {
  static idType: LdApiScene["type"] = "LdApiScene";

  readonly outputs: Map<string, LdOutput> = this.entityMap<LdApiOutput, LdOutput>(() => this.apiModel.outputs);
  readonly fixtures: Map<string, LdFixture> = this.entityMap<LdApiFixture, LdFixture>(() => this.apiModel.fixtures);
  readonly timelines: Map<string, LdTimeline> = this.entityMap<LdApiTimeline, LdTimeline>(() => this.apiModel.timelines);
}
