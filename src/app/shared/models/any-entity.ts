// Опции для AnyEntityLazy - итема
export interface anyEntityOptions<T>{
    name:       string          
    location:   string                  // http sublocation  key 
    selectId:   (i:T) => any            // entity to id value func    
    selBack:    (x:any) => string         // id value to http sublocation suffix
} 

export class AnyEntity
{
     [key: string]: any 
}  

export class AnyEntityId
{
     id:any   
     [key: string]: any 
}  
