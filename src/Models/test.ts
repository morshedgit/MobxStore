import { IConsumer, IService } from "./Common";

export class MainService<T extends IConsumer<T>> implements IService<T> {
  items: any[] = [];

  constructor(private item: T) {
    this.items = JSON.parse(localStorage.getItem(item.label) ?? "[]");
  }
  async create(item: T): Promise<boolean> {
    const newItem = item.toJson(item);
    this.items.push(newItem);
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
  async read(id: string): Promise<T> {
    const item = this.items.find((cur) => cur.id === id);
    if (!item) throw Error("NOT_FOUND");
    return this.item.fromJson(item);
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
    const items = await Promise.all(
      this.items.map((cur) => this.item.fromJson(cur))
    );
    return items;
  }
  async update(item: T): Promise<boolean> {
    const foundItem = this.items.find((cur) => cur.id === item.id);
    if (!foundItem) throw Error("NOT_FOUND");
    this.items = this.items.map((cur) => {
      if (item.id === cur.id) {
        return item.toJson(item);
      }
      return cur;
    });
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
  async delete(item: T): Promise<boolean> {
    const foundItem = this.items.find((cur) => cur.id === item.id);
    if (!foundItem) throw Error("NOT_FOUND");
    this.items = this.items.filter((cur) => cur.id !== item.id);
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
  async find(query: { key: string; value: any }[]) {
    const result = this.items.find((cur) => {
      return query
        .map(({ key, value }) => {
          if (cur[key] !== value) {
            return false;
          }
          return true;
        })
        .every((c) => c);
    });
    return result;
  }
}
