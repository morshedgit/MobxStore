import { makeObservable, observable } from "mobx";
import { ERROR_CODES, IStore, MainService, Store } from "./Common";
import { Consumer } from "./Common";
export class Category extends Consumer {
  title?: string = undefined;
  label = "Category";
  constructor(public store?: IStore<Category>) {
    super();
    makeObservable(this, {
      title: observable,
    });
  }
  async update(title: string) {
    const tempTitle = this.title;
    this.title = title;
    if (!this.store) throw Error(ERROR_CODES.SERVICE_NOT_AVAILABLE);
    const result = await this.store.updateItem(this);
    if (!result) this.title = tempTitle;
  }
  async fromJson(json: any) {
    const c = new Category();
    c.id = json.id;
    c.createdAt = json.createdAt;
    c.updatedAt = json.updatedAt;
    c.title = json.title;
    return c;
  }
  toJson(consumer: Category) {
    return {
      id: consumer.id,
      createdAt: consumer.createdAt,
      updatedAt: consumer.updatedAt,
      title: consumer.title,
    };
  }
}

export const categoryStore = new Store(new MainService(new Category()));

export class Ad extends Consumer {
  title: string = "";
  bio: string = "";
  category?: Category = undefined;
  tags: string[] = [];
  images: string[] = [];
}
