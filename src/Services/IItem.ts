export interface IItem<T> {
  new (...args: any[]): T;
  factory: () => T;
  fromJson: (item?: T) => T;
  toJson: () => unknown;
  label: string;
}
