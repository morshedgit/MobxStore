export interface IItem<T> {
  factory: () => T;
  fromJson: (item?: T) => T;
  toJson: () => unknown;
  id:string
  label: string;
}
