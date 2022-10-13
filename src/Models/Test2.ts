export interface IUser<T>{
    username:string
    password?:string
    // login:(credentials:{username:string,password:string})=>Promise<IUser>
    toJson:(consumer:T)=>any
}


export class Author implements IUser<Author>{
    id: string=''
    label: string = "Author"
    username: string=''
    password?: string | undefined
    constructor(/**
        private authService:IService<Author>
    */){

    }
    // async login (credentials: { username: string; password: string }) : Promise<Author>{

    //     return new Author(/**
    //         this.authService
    //     */)
    // }
    toJson(consumer: Author) : any{
        return {
            id:consumer.id,
            label:consumer.label,
            username:consumer.username,
        }
    }
}