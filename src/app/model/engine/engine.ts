import { LdApiEntity } from "../api/entity";
import { LdApiIdentifiedEntity } from "../api/common";
import { createEntity, updateOrReplaceEntity } from "./factory";

/**
 * A single LEDEasel engine instance.
 */
export class LdEngine {
}

export abstract class BaseLdEntity<TModel extends LdApiEntity> {
  private changeListeners: Array<() => void> = [];

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
      entityMap.set(apiEntity.uuid, createEntity(this.engine, apiEntity));
    }

    this.changeListeners.push(() => {
      const apiValue = getter(this.apiModel);
      const apiEntityMap = new Map<string, TChildApiEntity>();

      for (const apiEntity of apiValue) {
        apiEntityMap.set(apiEntity.uuid, apiEntity);

        if (!entityMap.has(apiEntity.uuid)) {
          entityMap.set(apiEntity.uuid, createEntity(this.engine, apiEntity));
        }
      }

      entityMap.forEach((entity, uuid) => {
        if (apiEntityMap.has(uuid)) {
          // tslint:disable-next-line:no-non-null-assertion
          entityMap.set(uuid, updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
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
      value: createEntity<TChildApiEntity, TChildEntity>(this.engine, getter(this.apiModel))
    };

    this.changeListeners.push(() => {
      value.value = updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
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
      entityArray.push(createEntity(this.engine, apiEntity));
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
        entityArray[i] = updateOrReplaceEntity<TChildApiEntity, TChildEntity>(
          this.engine,
          entityArray[i],
          apiValue[i]
        );
      }
    });

    return entityArray;
  }
}
