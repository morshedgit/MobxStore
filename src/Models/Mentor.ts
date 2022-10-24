import {  IService, User } from "./Common"

interface IAd {}
interface ISkill {}
interface Bio {}
interface IProfile {}
export class Mentor extends User{
    label: string = "Consultant"
    service?:IService<Mentor>
    ads:IAd[] = []
    skills:ISkill[]=[]
    bio:Bio={}
    profile:IProfile = {}
    constructor(service?:IService<Mentor>,id?:string){
        super(service)
        this.service = service

    }
    async fromJson (json: any) : Promise<Mentor>{
        const author = new Mentor(this.service)
        return author
    }
    toJson(consumer: Mentor) : any{
        return {
            id:consumer.id,
            label:consumer.label,
            username:consumer.username,
        }
    }
    
}