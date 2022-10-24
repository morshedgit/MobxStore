import { ERROR_CODES, IService, IStore, IUser } from "./Common";
import { Consumer } from "./Common";
export class Category extends Consumer {
  title?: string = undefined;
  description?: string = undefined;
  label = "Category";
  constructor(
    public store?: IStore<Category>,
    public service?: IService<Category>,
    public userFactory?: IUser<any>
  ) {
    super(service);
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
    c.owner = json.owner;
    c.title = json.title;
    c.description = json.description;
    c.userFactory = this.userFactory;
    return c;
  }
  toJson(consumer: Category) {
    return {
      id: consumer.id,
      createdAt: consumer.createdAt,
      updatedAt: consumer.updatedAt,
      owner:
        typeof consumer.owner === "string" ? consumer.owner : consumer.owner.id,
      title: consumer.title,
      description: consumer.description,
    };
  }
  async getOwner() {
    debugger;
    if (typeof this.owner !== "string") return;
    const o = await this.userFactory?.findUserById(this.owner);
    if (!o) return;
    this.owner = o;
  }
}

export class Ad extends Consumer {
  title: string = "";
  bio: string = "";
  category?: Category = undefined;
  tags: string[] = [];
  images: string[] = [];
}
