import { IService, IStore, User } from "./Common";

interface IAd {}
interface ISkill {}
interface Bio {}
interface IProfile {}
export class Mentor extends User {
  label: string = "Mentor";
  service?: IService<Mentor>;
  store?: IStore<Mentor>;
  ads: IAd[] = [];
  skills: ISkill[] = [];
  bio: Bio = {};
  profile: IProfile = {};
  constructor(service?: IService<Mentor>, store?: IStore<Mentor>, id?: string) {
    super(service);
    this.service = service;
    this.store = store;
  }
  async fromJson(json: any): Promise<Mentor> {
    const author = new Mentor(this.service);
    return author;
  }
  toJson(consumer: Mentor): any {
    return {
      id: consumer.id,
      label: consumer.label,
      username: consumer.username,
    };
  }
}
