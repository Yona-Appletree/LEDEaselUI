import { LdApiEntity } from "../api/entity";
import { BaseLdEntity, LdEngine } from "./engine";

const entityConstructorMap: { [type: string]: LdEntityClass<any, any> } = {};

export function LdEntity() {
  // tslint:disable-next-line:only-arrow-functions
  return function<
    TApiEntity extends LdApiEntity,
    TEntity extends BaseLdEntity<TApiEntity>
  >(constructor: LdEntityClass<TApiEntity, TEntity>) {
    entityConstructorMap[constructor.idType] = constructor;
  };
}

export interface LdEntityClass<
  TApiEntity extends LdApiEntity,
  TEntity extends BaseLdEntity<TApiEntity>
> {
  new (engine: LdEngine, entity: TApiEntity): TEntity;
  idType: TApiEntity["type"];
}

export function createEntity<TApi extends LdApiEntity, TEntity extends BaseLdEntity<TApi>>(
  engine: LdEngine,
  apiEntity: TApi
) {
  return new (entityConstructorMap[apiEntity.type] as any)(engine, apiEntity) as TEntity;
}

export function updateOrReplaceEntity<TApiEntity extends LdApiEntity,
  TEntity extends BaseLdEntity<TApiEntity>>(
  engine: LdEngine,
  entity: TEntity | null | undefined,
  apiEntity: TApiEntity
): TEntity {
  if (entity && entity.apiType === apiEntity.type) {
    entity.handleModelChange(apiEntity);
    return entity;
  } else {
    return createEntity<TApiEntity, TEntity>(engine, apiEntity);
  }
}
