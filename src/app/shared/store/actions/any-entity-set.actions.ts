import { Action } from '@ngrx/store';

import { anyEntityOptions } from '@appModels/any-entity';
import { anyEntityActions } from './any-entity.actions';



export enum AnyEntitySetActionTypes {
    ADD_ANY_ENTITY                      = '[Entity set] Add any entity',
    PREPARE_BY_LOC                      = '[Entity set] Try prepare entity by location',
    PREPARE_BY_LOC_COMPLETE             = '[Entity set] Prepare entity by location completed',
    PART_LOAD_BY_LOC                    = '[Entity set] Load data by resolved location',
    SET_CURRENT                         = '[Entity set] Set current entity',  
    EXEC_CURENT                         = '[Entity set] Execute current entity' ,
    EXEC                                = '[Entity set] Execute' ,
    EXEC_ANY_ENTITY_ACTION              = '[Entity set] Entyty action executing' ,
    COMPLETE_ANY_ENTITY_ACTION          = '[Entity set] Entyty action chain completed' ,
    EROR_ANY_ENTITY_SET                 = '[Entity set] Error' ,
    JAB_STATE                           = '[Entity set] Jab (pure state change)' 
}

export class PartLoadByLoc implements Action {
    readonly type = AnyEntitySetActionTypes.PART_LOAD_BY_LOC
    //reduserData: { needPrepare:boolean };
    constructor(public payload: string )  { }
}


export class PrepareByLoc implements Action {
    readonly type = AnyEntitySetActionTypes.PREPARE_BY_LOC
    reduserData: {isExistEntyty:boolean,
                  isDbl:boolean      }
    constructor(public payload: string )  { }
}

export class PrepareByLocComplete implements Action {
    readonly type = AnyEntitySetActionTypes.PREPARE_BY_LOC_COMPLETE
    constructor(public payload: boolean )  { }
}

export class Jab implements Action {
    readonly type = AnyEntitySetActionTypes.JAB_STATE
    constructor( )  { }
}

export class AddItem implements Action {
    readonly type = AnyEntitySetActionTypes.ADD_ANY_ENTITY
    constructor(public payload: anyEntityOptions<any> )  { }
}

export class SetCurrent implements Action {
    readonly type = AnyEntitySetActionTypes.SET_CURRENT
    constructor(public payload: string )  { }
}

export class Exec implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC
    reduserData: anyEntityOptions<any>;
    constructor(public payload: {name:string, itemAction: anyEntityActions  } ) {}
}

export class ExecCurrent implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC_CURENT
    reduserData: string; // курент
    constructor(public payload: anyEntityActions  ) {}
}

export class ExecItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION
    constructor(public payload: {itemOption:anyEntityOptions<any> , itemAction: anyEntityActions  } ) {}
}

export class CompleteItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.COMPLETE_ANY_ENTITY_ACTION
    constructor(public payload: {name:string} ) {}
}

export class ErrorAnyEntitySet implements Action {
    readonly type = AnyEntitySetActionTypes.EROR_ANY_ENTITY_SET;
    constructor(public payload: any) {}
}  

export type AnyEntitySetAction =
  | PartLoadByLoc
  | PrepareByLocComplete
  | PrepareByLoc
  | Exec
  | ExecCurrent
  | AddItem
  | SetCurrent
  | ExecItemAction
  | CompleteItemAction
  | ErrorAnyEntitySet  
  | Jab
;