import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";

import { of, from, Observable } from "rxjs";

import { map, mergeMap, catchError, tap, switchMap, filter } from "rxjs/operators";


import { AnyEntitySetActionTypes, Exec, ExecItemAction, CompleteItemAction, ExecCurrent, PrepareByLoc, PrepareByLocComplete, AddItem, PartLoadByLoc } from "@appStore/actions/any-entity-set.actions";
import { anyEntityActions, AnyEntityActionTypes, GetItemsMetaSuccess, ErrorAnyEntity, GetTemplateSuccess, GetItemsSuccess, GetItemsPartSuccess, GetItemsPart, SetRowSeed, AddItemSuccess  } from "@appStore/actions/any-entity.actions";
import { anyEntityOptions } from "@appModels/any-entity";

import { MetadataProvService } from "app/shared/services/metadata/metadata-prov.service";
import { ForeignKeyService } from "app/shared/services/foregin/foreign-key.service";
import { DataProvService } from "app/shared/services/data-prov.service";

//import { AnyEntityLazySetActionTypes, ExecItemAction,  CompleteItemAction, Exec } from "@appStore/actions/any-entity-lazy-set.actions";
//import { AnyEntityLazyActionTypes, anyEntityLazyActions, GetItemSuccess, GetItemNotFound } from "@appStore/actions/any-entity-lazy.actions";
//import { anyEntityOptions } from "@appModels/any-entity";
//import { anyEntityOptions } from "@appStore/reducers/any-entity-lazy-set.reduser";


@Injectable()
export class anyEntytySetEffects {
  constructor(
      private actions$:         Actions, 
      private dataService:      DataProvService,
      private metadataService:  MetadataProvService,
      private foreignService:   ForeignKeyService
) {}

    //const PrepareByLocBranch$ = ( loc:string  )   

    @Effect()   
    PartLoadByLoc$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.PART_LOAD_BY_LOC),
        map( (x:PartLoadByLoc) => new Exec(  {name:this.foreignService.locToName(x.payload) , itemAction: new GetItemsPart( x.payload)} ) )  
    ) ;        


    @Effect()   
    PrepareByLoc1$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.PREPARE_BY_LOC),
        map( (x:PrepareByLoc) => x.payload),
        mergeMap( (loc:string) =>  this.foreignService.prepareForeignData$(loc)),
        filter( x => x),
        map( x => new PrepareByLocComplete(true) )   
    ) ;        


    // @Effect()   
    // PrepareByLoc1$ = this.actions$.pipe(
    //     ofType(AnyEntitySetActionTypes.PREPARE_BY_LOC),
    //     map( (x:PrepareByLoc) => x.payload),
    //     mergeMap( (loc:string) =>  this.foreignService.isExist$(loc)),
    //     filter( x => x),
    //     map( x => new PrepareByLocComplete(true) )   
    // ) ;        

    // @Effect()   
    // PrepareByLoc2$ = this.actions$.pipe(
    //     ofType(AnyEntitySetActionTypes.PREPARE_BY_LOC),
    //     map( (x:PrepareByLoc) => x.payload),
    //     mergeMap( (loc:string) =>  this.foreignService.isExist$(loc).pipe(map( x=>({ l:loc , exist:x }) )) ),
    //     filter( x => !x.exist ),
    //     mergeMap( x => this.foreignService.buildOptions$(x.l)),
    //     map( x => new AddItem(x) ),
    //     catchError(error => of(new ErrorAnyEntity(error)))
    // );

    @Effect()   
    ExecAction$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.EXEC),
        //map( (x:Exec) => {console.log(x); return x }  ),
        map( (x:Exec) => new ExecItemAction({ itemOption: x.reduserData, itemAction: x.payload.itemAction } ))   
    )

    @Effect()   //
    ExecCurentItemAction$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.EXEC_CURENT),
        //tap((x:ExecCurrent) => console.log('Exec curent'+ x.reduserData)),
        map( (x:ExecCurrent) => new Exec({ name: x.reduserData, itemAction: x.payload } ))   
    )
      
    @Effect()   //.insert(action.payload.location, action.payload.data)
    ExecItemAction$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION),
        mergeMap( (x:ExecItemAction) =>  
            this.procNextSubAction$(
                x.payload.itemOption,  
                this.procSubAction$( x.payload.itemAction, x.payload.itemOption )
            )   
        )
    )            

    // proceccing child items effects            
    private procSubAction$ = ( action : anyEntityActions, options: anyEntityOptions<any>  ): Observable<any> => {
        switch(action.type){

            case ( AnyEntityActionTypes.ADD_ITEM) :
                return this.dataService.insert( options.location, action.payload )
                    .pipe(
                        tap( x=>  console.log(x) ),
                        map( x => new AddItemSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))    
                        //map( x => x.length > 0 ? new GetItemSuccess(x[0]) : new GetItemNotFound( action.payload ) )
                    ); 

            case ( AnyEntityActionTypes.GET_ITEMS_PART) :
                return this.foreignService.getItemsPart$( action.payload )
                    .pipe(
                        //tap( x=>  console.log(x) ),
                        map( x => new GetItemsPartSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))    
                        //map( x => x.length > 0 ? new GetItemSuccess(x[0]) : new GetItemNotFound( action.payload ) )
                    ); 

            case ( AnyEntityActionTypes.GET_ITEMS_META ) :
                return this.metadataService.metadata$( options.location ) // options.selBack(action.payload)
                    .pipe(
                        map(x => new GetItemsMetaSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))
                    ); 

            case ( AnyEntityActionTypes.GET_TEMPLATE_ROWSEED ) :        
            case ( AnyEntityActionTypes.GET_TEMPLATE ) :{
                //console.log('ssssssssssssss');
                return this.dataService.template$( options.location ) // options.selBack(action.payload)
                    .pipe(
                        //tap(x=> console.log(x)),
                        map(x => action.type == AnyEntityActionTypes.GET_TEMPLATE_ROWSEED ? [new GetTemplateSuccess(x), new SetRowSeed(x)] :[new GetTemplateSuccess(x)]  ),
                        mergeMap( x => from(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))
                    ); 
            }
            
            case ( AnyEntityActionTypes.GET_ITEMS ) :
                return this.dataService.items$( options.location, options.selBack(action.payload) )
                    .pipe(
                        //tap( x=>  console.log(x) ),
                        map( x => new GetItemsSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))    
                        //map( x => x.length > 0 ? new GetItemSuccess(x[0]) : new GetItemNotFound( action.payload ) )
                    ); 
                        
            default:
                return of(null);
        }
    }   
    
    private procNextSubAction$ = ( options: anyEntityOptions<any>,  act$: Observable<any> ): Observable<any> => 
        act$.pipe( 
            map(x  =>  x != null ? 
                    new ExecItemAction( { itemOption:options, itemAction: x } ) : 
                    new CompleteItemAction({ name: options.name } ) 
            )
        );       


}
