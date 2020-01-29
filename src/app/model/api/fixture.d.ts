import { LdApiDouble, LdApiIdentifiedEntity, LdApiInt, LdApiPoint2 } from "./common";

type LdApiFixture = LdApiFixtureStrip;

////////////////////////////////////////////////////////////////////////
// Base

interface BaseLdApiFixture extends LdApiIdentifiedEntity {
  type: LdApiFixture["type"];
  pixels: Array<LdApiFixturePixelGroup>;
}
interface LdApiFixturePixelGroup {
  output: string;
  start: LdApiInt;
  count: LdApiInt;
}


////////////////////////////////////////////////////////////////////////
// Strip

interface LdApiFixtureStrip extends BaseLdApiFixture {
  type: "LdApiFixtureStrip";
  uiConfig: LdApiFixtureStripUiConfig;
}

interface LdApiFixtureStripUiConfig {
  ledsPerMeter: LdApiDouble;
  sections: Array<LdApiFixtureStripUiConfigSection>;
}

interface LdApiFixtureStripUiConfigSection {
  ledCount: LdApiInt;
  startPos: LdApiPoint2;
  angle: LdApiDouble;
}
