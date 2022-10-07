export interface IItem<T> {
  fromJson: (item?: T) => T;
  toJson: () => unknown;
  id:string
  label: string;
}
