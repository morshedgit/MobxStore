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
  async update({
    title,
    description,
    ownerId,
  }: {
    title: string;
    description: string;
    ownerId: string;
  }) {
    const tempTitle = this.title;
    const tempDesc = this.description;
    const tempOwnerId = this.creatorId;
    this.title = title;
    this.description = description;
    this.creatorId = ownerId;

    if (!this.store) throw Error(ERROR_CODES.SERVICE_NOT_AVAILABLE);
    const result = await this.store.updateItem(this);
    if (!result) {
      this.title = tempTitle;
      this.description = tempDesc;
      this.creatorId = tempOwnerId;
    }
  }
  async fromJson(json: any) {
    const c = new Category();
    c.id = json.id;
    c.createdAt = json.createdAt;
    c.updatedAt = json.updatedAt;
    c.creatorId = json.creator;
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
      creator: consumer.creatorId,
      title: consumer.title,
      description: consumer.description,
    };
  }
  async getCreator() {
    if (this.creator) return;
    const o = await this.userFactory?.findUserById(this.creatorId);
    if (!o) return;
    this.creator = o;
  }
}

export class Ad extends Consumer {
  title: string = "";
  bio: string = "";
  category?: Category = undefined;
  tags: string[] = [];
  images: string[] = [];
}
