import { LdApiTimeline } from "./timeline";
import { LdApiFixture } from "./fixture";
import { LdApiOutput } from "./output";

interface LdApiScene {
  type: "LdApiScene";

  outputs: LdApiOutput[];
  fixtures: LdApiFixture[];
  timelines: LdApiTimeline[];
}
