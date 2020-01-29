import { LdApiColor, LdApiIdentifiedEntity, LdApiInt } from "./common";

type LdApiOutput = LdApiOutputFastled | LdApiOutputArtnet;

////////////////////////////////////////////////////////////////////////
// Base

interface BaseLdApiOutput extends LdApiIdentifiedEntity {
  type: LdApiOutput["type"];
}


////////////////////////////////////////////////////////////////////////
// FastLED

interface LdApiOutputFastled extends BaseLdApiOutput {
  type: "LdApiOutputFastled";
  chip: string;
  correction: LdApiColor;
  temperature: LdApiColor;
  ledCount: LdApiInt;
}


////////////////////////////////////////////////////////////////////////
// Artnet

interface LdApiOutputArtnet extends BaseLdApiOutput {
  type: "LdApiOutputArtnet";
  host: string;
  port: number;
  universeCount: number;
  perUniverseChannelCount: number;
}


