export interface IItem<T> {
  fromJson: (item?: T) => Promise<T>;
  toJson: () => unknown;
  id: string;
  label: string;
}
