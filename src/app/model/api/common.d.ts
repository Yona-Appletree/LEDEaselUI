import { LdApiEntity } from "./entity";

export type LdApiColor = number;
export type LdApiInt = number;
export type LdApiDouble = number;
export interface LdApiDictionary<T> { [id: string]: T; }

interface LdApiPoint2 {
  x: LdApiDouble;
  y: LdApiDouble;
}

interface LdApiIdentifiedEntity {
  type: LdApiEntity["type"];
  uuid: string;
}
