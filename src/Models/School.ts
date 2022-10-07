import { makeAutoObservable } from "mobx";
import { IItem } from "../Services/IItem";
import { Store } from "../Stores/Store";

export class School implements IItem<School>{
    id: string;
    label: "School" = "School"
    createdAt:string
    constructor(
      public store: Store<School>,
      itemId?: string,
      public name?:string,
      public info?:string
      
    ) {
      makeAutoObservable(this);
      this.id = itemId ?? Math.random().toString(32);
      this.createdAt = (new Date()).toUTCString()
    }
  
    async update(name:string,info:string) {
      this.name = name;
      this.info = info;
      await this.store.updateItem(this);
    }
  
    async delete() {
        await this.store.deleteItem(this);
    }
  
    fromJson(json?: School) {
      const newSchool = new School(this.store);
      if (!json) {
        return newSchool;
      }
      newSchool.id = json.id;
      newSchool.label = json.label;
      newSchool.name = json.name;
      newSchool.info = json.info;
      newSchool.createdAt = json.createdAt;
      return newSchool;
    }
  
    toJson() {
      return {
        id: this.id,
        label: this.label,
        name: this.name,
        info: this.info,
        createdAt: this.createdAt
      };
    }
}