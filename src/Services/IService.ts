export interface IService<T> {
  create: (item: T) => Promise<T>;
  read: (id: string) => Promise<T | undefined>;
  update: (item: T) => Promise<T>;
  delete: (id: string) => Promise<T>;
  getAll: () => Promise<T[]>;
}
