// // interface IItem<T> {
// //   new (): T;
// //   factory(): T;
// // }

// // interface ICar {
// //   id: string;
// //   save(): string;
// // }

// // const Car: IItem<ICar> = class {
// //   id: string;
// //   static factory() {
// //     return new Car();
// //   }
// //   save() {
// //     return "This is an instance method";
// //   }
// // };

// // Car.factory();

// // // Has type MyClassInstance
// // const instance = new Car();
// // instance.save();

// // class Service<T> {
// //   constructor(private factory: IItem<T>) {}

// //   runStatic() {
// //     this.factory.factory();
// //   }
// // }

// // const myCar = new Car();



// //\\ ######################################### //\\

// type TypeConstructor<T> = new (...args: any[]) => T

// interface Source<T>  {
//   // factory: () => T;
//   fromJson: (item?: T) => T;
//   // toJson: () => unknown;
//   // label: string;
// }



// class Store<T extends Source<T>> {
//   store:T
//   constructor( factory:TypeConstructor<T>){
//     this.store = new factory()
//   }
//   save(){
//     this.store.fromJson()
//   }
// }

// export class Phone implements Source<Phone>{
//   fromJson: (item?: Phone | undefined) => Phone;

// }
// // const phoneMaker = <T>(const:Source<T>):Source<T>=>{
// //   return new const<T>()
// // }
// const myStore = new Store<Phone>(Phone)




// const List = <T extends Source<T>> (props:{store:Store<T>})=>{

// }

// const myList = List({store:myStore})
export {}