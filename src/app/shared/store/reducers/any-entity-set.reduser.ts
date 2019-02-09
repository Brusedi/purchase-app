import { anyEntityOptions } from "@appModels/any-entity";
import { anyEntityActions } from "@appStore/actions/any-entity.actions";
import { AnyEntytyState }   from "./any-entity.reduser";
import { AnyEntitySetAction, AnyEntitySetActionTypes, ExecItemAction } from "@appStore/actions/any-entity-set.actions";
import * as fromEntityReduser from "./any-entity.reduser"
import { locationToName } from "app/shared/services/foregin/foreign-key.helper";

// 
export interface AnyEntytySetItemState<T> {
    state      : AnyEntytyState<T>,
    option     : anyEntityOptions<T>,
    action?    : anyEntityActions 
} 

// key as location
export interface State {  
    items:      { [key: string]: AnyEntytySetItemState<any> };      // poot datas
    currentId?: string ;                                            // active Entity name    
    prepareQueue: string[];                                         // 
    preparing?: string;
    error:      any ;
    jab:        boolean;
}

export const initialState: State = {
    items: ({}),
    currentId:null,
    prepareQueue:[],
    preparing: null,
    error:null,
    jab: true
};

export function reducer(state :State  = initialState, action: AnyEntitySetAction): State {
    //console.log( action) ;
    
    switch (action.type) {
        
        case AnyEntitySetActionTypes.PART_LOAD_BY_LOC:{    
            //action.reduserData = {...action.reduserData, needPrepare: }    
            return state ; //{ ...state , jab:!state.jab};    
        }     

        case AnyEntitySetActionTypes.PREPARE_BY_LOC_COMPLETE: {
            const que =  state.prepareQueue.length > 0 ? state.prepareQueue.slice(1,state.prepareQueue.length) : [];
            return { ...state,
                 preparing: (state.prepareQueue.length > 0 ?  state.preparing[0] : null ),
                 prepareQueue: que,      
            }
        };
        case AnyEntitySetActionTypes.PREPARE_BY_LOC:{
            // 080219 отбрасываем повторы
            const iNotDoble = (state.preparing &&  state.prepareQueue.indexOf(action.payload)<0)

            action.reduserData = ({ isExistEntyty:(locationToName(action.payload) in state.items), 
                                     isDbl:!iNotDoble});// locationToName(action.payload) in state.items
            return { ...state,
                prepareQueue: (
                    iNotDoble ?
                    [...state.prepareQueue, action.payload ]  : 
                    state.prepareQueue),      // если что то обраб, то в очередь ссукины дети, иначе в обработку                    
                preparing: (state.preparing ?  state.preparing : action.payload)
            }
        }    
        case AnyEntitySetActionTypes.ADD_ANY_ENTITY:{
            //console.log('ADD_ANY_ENTITY');
            //console.log(action.payload);
            
            return { 
                ...state, 
                items:{ ...state.items,  
                    [action.payload.name]: { 
                        state:      fromEntityReduser.initStateFromSelFoo( action.payload.selectId),
                        option:     action.payload,
                        action:     null
                    }
                }
            };   
        }    
        case AnyEntitySetActionTypes.EXEC : {                                
            action.reduserData = (< AnyEntytySetItemState<any>>state.items[action.payload.name]).option; // догрузка
            return {...state};
        }            

        case AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION: {
            //console.log(action.payload);
            //console.log(state);
            const s = { ...state, 
                items:{ ...state.items,
                        [action.payload.itemOption.name]:{ 
                            ...state.items[action.payload.itemOption.name],
                            action: (<ExecItemAction>action).payload.itemAction,
                            state: fromEntityReduser.reducerFromSelFoo( state.items[action.payload.itemOption.name].option.selectId )(
                                state.items[action.payload.itemOption.name].state, (<ExecItemAction>action).payload.itemAction 
                            )     
                    }}};
            //console.log(s);        
            return s;        
        };    
        
        case AnyEntitySetActionTypes.COMPLETE_ANY_ENTITY_ACTION: {
            return { ...state,
                items:{ ...state.items,  
                    [action.payload.name]:{ 
                        ...state.items[action.payload.name],
                        action: null
                    }}};        
        };    

        case AnyEntitySetActionTypes.EROR_ANY_ENTITY_SET:{        
                //console.log(action);
                return { ...state, error:action.payload };    
            }    

        case AnyEntitySetActionTypes.SET_CURRENT:{        
                //console.log(action);
                return { ...state, currentId:action.payload };    
            }        

        case AnyEntitySetActionTypes.JAB_STATE:{        
                return { ...state, jab:!state.jab};    
            }        

        case AnyEntitySetActionTypes.EXEC_CURENT:{  
            action.reduserData = state.currentId;      // догруз
                return { ...state};    
            }        


        default:
            return state;
    }
}

 