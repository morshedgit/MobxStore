export class UUID{
    
    static generateID(){
        return Math.random().toString(32).slice(2)
    }
}

export interface IConsumer<T> {
    id:string
    label:string 
    fromJson:(json:any)=>Promise<T>
    toJson:(consumer:T)=>any
}

export interface IItem<T,A> extends IConsumer<T>{
    owner:Promise<IUser<A>>
}

export interface IUser<T> extends IConsumer<T>{
    username:string
    password?:string
    login:(credentials:{username:string,password:string})=>Promise<T>
    logout:()=>Promise<boolean>
    signup:(credentials:{username:string,password:string})=>Promise<boolean>
}

export class Author implements IUser<Author>{
    id: string=''
    label: string = "Author"
    username: string=''
    password?: string | undefined
    constructor(private authService:IService<Author>){

    }
    async login (credentials: { username: string; password: string }) : Promise<Author>{
        return new Author(this.authService)
    }
    async logout () : Promise<boolean>{
        return true
    }
    async signup (credentials: { username: string; password: string }) : Promise<boolean>{
        return true
    }
    async fromJson (json: any) : Promise<Author>{
        return new Author(this.authService)
    }
    toJson(consumer: Author) : any{
        return {
            id:consumer.id,
            label:consumer.label,
            username:consumer.username,
        }
    }
    
}

export interface IService<T extends IConsumer<T>> {
    create:(item:T)=>Promise<boolean>
    read:(id:string,label:string)=>Promise<T>
    readAll:(label:string)=>Promise<T[]>
    update:(item:T)=>Promise<boolean>
    delete:(item:T)=>Promise<boolean>
}


export interface IStore<A,T extends IItem<T,A>>{
    getItems:()=>Promise<T[]>
    createItem:(item:T)=>Promise<boolean>
    deleteItem:(item:T)=>Promise<boolean>
    updateItem:(item:T)=>Promise<boolean>
    getItem:(id:string)=>Promise<T>
}

let LOCAL_CACHE:Record<string,any[]> = {}
export class LocalService<T extends IConsumer<T>> implements IService<T>{

    async create(item: T): Promise<boolean>{
        if(!(item.label in LOCAL_CACHE)){
            LOCAL_CACHE[item.label] = []
        }
        LOCAL_CACHE[item.label].push(item)
        return true
    }
    async read(id: string,label:string):Promise<T>{
        if(!LOCAL_CACHE[label]) LOCAL_CACHE[label] = []
        const item = LOCAL_CACHE[label].find(item=>item.id === id)
        if(!item) throw Error("NOT FOUND")
        return item as T
    }
    async readAll(label:string): Promise<T[]>{
        
        if(!LOCAL_CACHE[label]) LOCAL_CACHE[label] = []
        return LOCAL_CACHE[label] as T[]
    }
    async update(item: T):Promise<boolean>{        
        if(!LOCAL_CACHE[item.label]) LOCAL_CACHE[item.label] = []
        const foundItem = LOCAL_CACHE[item.label].find(cur=>cur.id === item.id)
        if(!foundItem) return false
        LOCAL_CACHE[item.label] = LOCAL_CACHE[item.label].map(cur=>{
            if(cur.id === item.id){
                return item
            }
            return cur
        })
        return true
    }
    async delete(item: T):Promise<boolean>{
        
        if(!LOCAL_CACHE[item.label]) LOCAL_CACHE[item.label] = []
        const foundItem = LOCAL_CACHE[item.label].find(cur=>cur.id === item.id)
        if(!foundItem) return false
        LOCAL_CACHE[item.label] = LOCAL_CACHE[item.label].filter(cur=>cur.id !== item.id)
        return true
    }
}

export class Store<A,T extends IItem<T,A>> implements IStore<A,T>{
    items:T[]=[]
    constructor(private storeLabel:string,private service:IService<T>){
        this.service.readAll(this.storeLabel)
        .then((items)=>{
            this.items = items
        })

    }

    async getItems(): Promise<T[]>{

        return this.items
    }
    async createItem(item: T):Promise<boolean>{
        const result = await this.service.create(item)
        if(!result){
            return result
        }
        this.items.push(item)
        return result
    }
    async deleteItem(item: T):Promise<boolean>{
        const result = await this.service.delete(item)
        if(!result){
            return result
        }
        const itemIndex = this.items.findIndex(cur=>cur.id === item.id)
        if(itemIndex !== 0 && !itemIndex){
            throw Error('NOT FOUND')
        }
        this.items.splice(itemIndex,1)
        return result
    }
    async updateItem(item: T):Promise<boolean>{        
        const result = await this.service.update(item)
        if(!result){
            return result
        }
        const itemIndex = this.items.findIndex(cur=>cur.id === item.id)
        if(itemIndex !== 0 && !itemIndex){
            throw Error('NOT FOUND')
        }
        this.items.splice(itemIndex,1,item)
        return result
    }
    async getItem(id: string):Promise<T>{
        const item = this.items.find(cur=>cur.id === id)
        if(!item){
            throw Error('NOT FOUND')
        }
        return item
    }
    
}
class Book implements IItem<Book,Author>{
    owner: Promise<IUser<Author>>
    id: string
    label: string = 'Book'
    constructor(private bookStore:Store<Author,Book>,owner:IUser<Author>,id:string){
        this.id = id?? UUID.generateID()
        this.owner = owner
    }
    async fromJson(json: any): Promise<Book>{
        const author = this.owner.fromJson(json)
        return new Book(this.bookStore,author,this.id)
    }
    async toJson(consumer: Book){
        return {
            owner:consumer.owner.id,
            id:consumer.id,
            label:consumer.label,
        }
    }

}