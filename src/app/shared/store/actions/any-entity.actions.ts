import { Action } from "@ngrx/store";
//import { FieldDescribes } from "@appModels/metadata";

// Для GET_ITEMS_PART не совсем верная семантика надо повошкатся потом может быть скоректировать
//


export enum AnyEntityActionTypes {
    GET_ITEMS               = '[Entity] Load all items',
    GET_ITEMS_SUCCESS       = '[Entity] All items loaded success ',

    GET_ITEMS_PART          = '[Entity] Load one or some items',
    GET_ITEMS_PART_SUCCESS  = '[Entity] One or some item loaded success',

    GET_ITEMS_META          = '[Entity] Load items medadata',
    GET_ITEMS_META_SUCCESS  = '[Entity] Item medadata loaded success',

    ADD_ITEM                =  '[Entity] Add item',
    ADD_ITEM_SUCCESS        =  '[Entity] Item added success',

    GET_TEMPLATE            = '[Entity] Load template',
    GET_TEMPLATE_ROWSEED    = '[Entity] Load template and set in rowSeed',
    GET_TEMPLATE_SUCCESS    = '[Entity] Item template loaded success',

    SET_ROW_SEED            = '[Entity] Item rowseed set ',    
    CHANGE_ROW_SEED         = '[Entity] Applay data to rowseed set (changed)',  

    EROR_ANY_ENTITY         = '[Entity] Error',

    JAB_STATE               = '[Entity] Jab (pure state change)' 
}

export class Jab implements Action {
    readonly type = AnyEntityActionTypes.JAB_STATE
    constructor( )  { }
}

export class GetItemsPart implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_PART;
    constructor(public payload: string ) {}
}

export class GetItemsPartSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_PART_SUCCESS;
    constructor(public payload: ({ entites: T[] , ids:any[], request:string })  ) {}
}

export class GetItems implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS;
    constructor(public payload: any ) {}
}
export class GetItemsSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_SUCCESS;
    constructor(public payload: T[] ) {}
}

export class AddItem<T> implements Action {
    readonly type = AnyEntityActionTypes.ADD_ITEM;
    constructor(public payload: T ) {}
}
export class AddItemSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.ADD_ITEM_SUCCESS;
    constructor(public payload: T ) {}
}

export class GetItemsMeta implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_META;
    constructor() {}
}
export class GetItemsMetaSuccess implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_META_SUCCESS;
    constructor(public payload: any  ) {}  //FieldDescribes
}

export class GetTemplate implements Action {
    readonly type = AnyEntityActionTypes.GET_TEMPLATE;
    constructor() {}
}

export class GetTemplateRowSeed implements Action {
    readonly type = AnyEntityActionTypes.GET_TEMPLATE_ROWSEED;
    constructor() {}
}

export class GetTemplateSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.GET_TEMPLATE_SUCCESS;
    constructor(public payload: T  ) {}  
}

export class SetRowSeed<T> implements Action {
    readonly type = AnyEntityActionTypes.SET_ROW_SEED;
    constructor(public payload: T  ) {}  

}

export class ChangeRowSeed<T> implements Action {
    readonly type = AnyEntityActionTypes.CHANGE_ROW_SEED;
    constructor(public payload: T  ) {}  
}


export class ErrorAnyEntity implements Action {
    readonly type = AnyEntityActionTypes.EROR_ANY_ENTITY;
    constructor(public payload: any) {}
}  

export type anyEntityActions =
  | GetItems
  | GetItemsSuccess<any>
  | GetItemsPart
  | GetItemsPartSuccess<any>
  | GetItemsMeta
  | GetItemsMetaSuccess
  | AddItem<any>
  | AddItemSuccess<any>
  | GetTemplate
  | GetTemplateRowSeed
  | GetTemplateSuccess<any>
  | SetRowSeed<any>
  | ChangeRowSeed<any>
  | ErrorAnyEntity
  | Jab
  ;