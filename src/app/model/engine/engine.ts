import { LdApiEntity } from "../api/entity";
import { LdApiIdentifiedEntity } from "../api/common";

/**
 * A single LEDEasel engine instance.
 */
export class LdEngine {
}

export abstract class BaseLdEntity<TModel extends LdApiEntity> {
  static entityConstructorMap: { [type: string]: LdEntityClass<any, any> } = {};

  static createEntity<TApi extends LdApiEntity, TEntity extends BaseLdEntity<TApi>>(
    engine: LdEngine,
    apiEntity: TApi
  ) {
    return new (this.entityConstructorMap[apiEntity.type] as any)(engine, apiEntity) as TEntity;
  }

  static updateOrReplaceEntity<TApiEntity extends LdApiEntity,
    TEntity extends BaseLdEntity<TApiEntity>>(
    engine: LdEngine,
    entity: TEntity | null | undefined,
    apiEntity: TApiEntity
  ): TEntity {
    if (entity && entity.apiType === apiEntity.type) {
      entity.handleModelChange(apiEntity);
      return entity;
    } else {
      return this.createEntity<TApiEntity, TEntity>(engine, apiEntity);
    }
  }

  private changeListeners: Array<() => void> = [];
  computedProperties = new Map<string, any>();

  get apiType() {
    return this.apiModel.type;
  }

  constructor(
    public engine: LdEngine,
    public apiModel: TModel
  ) {
  }

  handleModelChange(
    apiModel: TModel
  ) {
    this.computedProperties.clear();

    for (const listener of this.changeListeners) {
      listener();
    }
  }

  protected entityMap<
    TChildApiEntity extends LdApiIdentifiedEntity & LdApiEntity,
    TChildEntity extends BaseLdEntity<TChildApiEntity>
  >(
    getter: (model: TModel) => TChildApiEntity[]
  ): Map<string, TChildEntity> {
    const entityMap = new Map<string, TChildEntity>();

    for (const apiEntity of getter(this.apiModel)) {
      entityMap.set(apiEntity.uuid, BaseLdEntity.createEntity(this.engine, apiEntity));
    }

    this.changeListeners.push(() => {
      const apiValue = getter(this.apiModel);
      const apiEntityMap = new Map<string, TChildApiEntity>();

      for (const apiEntity of apiValue) {
        apiEntityMap.set(apiEntity.uuid, apiEntity);

        if (!entityMap.has(apiEntity.uuid)) {
          entityMap.set(apiEntity.uuid, BaseLdEntity.createEntity(this.engine, apiEntity));
        }
      }

      entityMap.forEach((entity, uuid) => {
        if (apiEntityMap.has(uuid)) {
          // tslint:disable-next-line:no-non-null-assertion
          entityMap.set(uuid, BaseLdEntity.updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
            this.engine,
            entity,
            // tslint:disable-next-line:no-non-null-assertion
            apiEntityMap.get(uuid) !!
          ));
        } else {
          entityMap.delete(uuid);
        }
      });
    });

    return entityMap;
  }

  protected childEntity<TChildApiEntity extends LdApiEntity, TChildEntity extends BaseLdEntity<TChildApiEntity>>(
    getter: (model: TModel) => TChildApiEntity
  ): { value: TChildEntity } {
    const value = {
      value: BaseLdEntity.createEntity<TChildApiEntity, TChildEntity>(this.engine, getter(this.apiModel))
    };

    this.changeListeners.push(() => {
      value.value = BaseLdEntity.updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
        this.engine,
        value.value,
        getter(this.apiModel)
      );
    });

    return value;
  }


  protected entityArray<
    TChildApiEntity extends LdApiEntity,
    TChildEntity extends BaseLdEntity<TChildApiEntity>
  >(
    getter: (model: TModel) => TChildApiEntity[]
  ): TChildEntity[] {
    const entityArray: TChildEntity[] = [];

    for (const apiEntity of getter(this.apiModel)) {
      entityArray.push(BaseLdEntity.createEntity(this.engine, apiEntity));
    }

    this.changeListeners.push(() => {
      const apiValue = getter(this.apiModel);

      // Remove Extra entities
      for (let i = apiValue.length; i < entityArray.length; i++) {
        delete entityArray[i];
      }

      entityArray.length = apiValue.length;

      // Update existing entities
      for (let i = apiValue.length; i < apiValue.length; i++) {
        entityArray[i] = BaseLdEntity.updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
          this.engine,
          entityArray[i],
          apiValue[i]
        );
      }
    });

    return entityArray;
  }
}


export function LdEntity() {
  // tslint:disable-next-line:only-arrow-functions
  return function <TApiEntity extends LdApiEntity,
    TEntity extends BaseLdEntity<TApiEntity>>(constructor: LdEntityClass<TApiEntity, TEntity>) {
    BaseLdEntity.entityConstructorMap[constructor.idType] = constructor;
  };
}

export function LdComputed() {
  return (
    target: BaseLdEntity<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const oldGet = descriptor.get
      || (() => { throw new Error("@LdComputed property must have a getter"); })();

    // tslint:disable-next-line:only-arrow-functions
    descriptor.get = function() {
      const computedProperties = (this as BaseLdEntity<any>).computedProperties;

      if (computedProperties.has(propertyKey)) {
        return computedProperties.get(propertyKey);
      } else {
        const value = oldGet.apply(this);
        computedProperties.set(propertyKey, value);
        return value;
      }
    };
  };
}

export interface LdEntityClass<TApiEntity extends LdApiEntity,
  TEntity extends BaseLdEntity<TApiEntity>> {
  new(engine: LdEngine, entity: TApiEntity): TEntity;

  idType: TApiEntity["type"];
}
