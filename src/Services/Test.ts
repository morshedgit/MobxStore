// export class C_<T> {
//   //   static myStatic: T;
// }

// interface Ctor {
//   myStatic: this extends typeof C_<infer T> ? T : never;
// }

// const C: typeof C_ & Ctor = C_ as any;

// C.myStatic; // unknown
// C<number>.myStatic; // number

// type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T;

// export interface ColumnConstructor<T> {
//   readonly _name: string;
//   readonly comment: string;
//   readonly dataType: Constructor<T>;

//   new (value: T): Column<T>;
// }

// interface Column<T> {
//   readonly value: T;
// }

// function Column<T>(dataType: Constructor<T>): ColumnConstructor<T> {
//   return class Column {
//     static readonly _name: string;
//     static readonly comment: string;
//     static readonly dataType = dataType;

//     constructor(readonly value: T) {}
//   };
// }

// class Big {
//   constructor(private x: number) {}
// }

// class Bigint {
//   constructor(readonly value: Big = new Big(0)) {}
// }

// class Amount extends Column(Bigint) {
//   static readonly _name: string = '"amt"';
// }

// class Quantity extends Column(Bigint) {
//   static readonly _name: string = '"qty"';
// }

export interface IMyConstructor<T, Args extends any[] = any[]> {
  new (...args: Args): T;
  serialize(item: T): any;
  //   code: number;
}

// class MyUser implements IMyUser<MyUser> {
//   constructor(public username: string) {}
//   toJson(user: MyUser) {
//     return {
//       username: user.username,
//     };
//   }
//   fromJson(json: any) {
//     return new MyUser(json.username);
//   }
// }

// interface IMyUser<T> extends IMyConstructor<T> {
//   toJson: (u: T) => unknown;
//   fromJson: (json: any) => T;
// }

// class Service<T extends IMyUser<T>> {
//   constructor(public UserClass: T) {}

//   save(user: T) {
//     const json = this.UserClass.toJson(user);
//   }
// }

// const s = new Service(MyUser);

// export interface Constructor<T, Args extends any[] = any[]> {
//   new (...args: Args): T;
// }

// export function staticImplements<T>() {
//   return <U extends T>(constructor: U) => {
//     constructor;
//   };
// }
interface IService<T> {
  save(item: T): boolean;
}

interface IConsumer {
  serialize(consumer: IConsumer): any;
}

class Service<T extends IConsumer> implements IService<T> {
  public constructor(private consumer: IConsumer) {}
  public save(consumer: T) {
    const json = this.consumer.serialize(consumer);
    return true;
  }
}

class User implements IConsumer {
  public code: number = 0;
  public name: string;
  service?: IService<User>;
  public constructor(service?: IService<User>) {
    this.service = service;
    this.name = "xyz";
  }

  public save() {
    const result = this.service?.save(this);
    return result;
  }

  public serialize(user: User) {
    return { name: this.name };
  }
}

const user = new User(new Service(new User()));

console.log(user.save());
