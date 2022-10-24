import { ERROR_CODES, IStore } from "./Common";
import { Consumer } from "./Common";
export class Category extends Consumer {
  id: string = "";
  title?: string = undefined;
  description?: string = undefined;
  label = "Category";
  constructor(public store?: IStore<Consumer>) {
    super();
  }
  async update({ title, description }: { title: string; description: string }) {
    const tempTitle = this.title;
    const tempDesc = this.description;
    this.title = title;
    this.description = description;

    if (!this.store) throw Error(ERROR_CODES.SERVICE_NOT_AVAILABLE);
    const result = await this.store.updateItem(this);
    if (!result) {
      this.title = tempTitle;
      this.description = tempDesc;
    }
  }
  async fromJson(json: any) {
    const c = new Category();
    c.id = json.id;
    c.createdAt = json.createdAt;
    c.updatedAt = json.updatedAt;
    c.title = json.title;
    c.description = json.description;
    return c;
  }
  toJson(consumer: Category) {
    return {
      id: consumer.id,
      createdAt: consumer.createdAt,
      updatedAt: consumer.updatedAt,
      title: consumer.title,
      description: consumer.description,
    };
  }
}

export class Ad extends Consumer {
  title: string = "";
  bio: string = "";
  category?: Category = undefined;
  tags: string[] = [];
  images: string[] = [];
}
