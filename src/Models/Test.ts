interface IItem<T> {
  new (): T;
  factory(): T;
}

interface ICar {
  id: string;
  save(): string;
}

const Car: IItem<ICar> = class {
  id: string;
  static factory() {
    return new Car();
  }
  save() {
    return "This is an instance method";
  }
};

Car.factory();

// Has type MyClassInstance
const instance = new Car();
instance.save();

class Service<T> {
  constructor(private factory: IItem<T>) {}

  runStatic() {
    this.factory.factory();
  }
}

const myCar = new Car();
