import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { locationToName,  getBaseLocation, getIdFromMeta, locToEntityOption, isFullIndepended } from './foreign-key.helper';
import { tap, filter, take, map, mergeMap, switchMap, combineLatest, last, distinctUntilChanged} from 'rxjs/operators';
import { Exec, AddItem } from '@appStore/actions/any-entity-set.actions';
import { GetItemsMeta, GetItems } from '@appStore/actions/any-entity.actions';

import { DataProvService } from '../data-prov.service';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';

//import { of, combineLatest } from 'rxjs';

/**
 *  Сервис обработки значений вторичных ключей заливаемыз с бэкенда
 *  110119
 *  с ходу выделяется 3 группы
 *  1. Full independed (сразу льется весь ентити) 
 *  2. Part independed (льется часть ентити) 
 *  3. Depended        (часть ентити связанная с текущим контекстом ) 
 */


const QUESTION_PROP_FK_NAME = 'optionsRefLoc';

@Injectable({
  providedIn: 'root'
})


export class ForeignKeyService {
  constructor(
      private store: Store<fromStore.State>,
      private dataService: DataProvService
    ){
      //this.store.select( fromSelectors.selectIsExist('NVASDServiceDesc')).subscribe( x => console.log(x) );
      //this.store.select( fromSelectors.selectIsMetadataLoaded('NVASDServiceDesc')).subscribe( x => console.log(x) );
      //this.store.select( fromSelectors.selectData('NVASDServiceDesc')).subscribe( x => console.log(x) );
        
  }

  public isExist$ = (loc:string) => this.store.select(fromSelectors.selectIsExist(locationToName(loc)));
  public isPrepared$ = (loc:string) => this.store.select(fromSelectors.selectIsPrepared(locationToName(loc)));
    
  
  public locToName = locationToName;  
  
  public buildOptions$ = (loc:string) =>  
    this.dataService.metadata$( getBaseLocation(loc) ).pipe(
      map( x => getIdFromMeta(x)  ),
      map( x => locToEntityOption(loc, x) )
  );
  /**
   *  подготавливает стор 
   */    
  public prepareForeignData$ = (loc:string) => {  

    const getLocOption$ = ( loc:string, isFromStore:boolean ) =>     // либо билдит с эффектами либо из стора если он там есть         
      (isFromStore ?  
          this.store.select( fromSelectors.selectDataOptions(locationToName(loc))).pipe(take(1) ):
          this.buildOptions$( loc ).pipe(
            //tap(x=>console.log('bld'))
            )
      ).pipe(

        map( x => ({ opt:x, isExst:isFromStore }) )
      )

    return this.isExist$(loc)
      .pipe(
        //tap(x=>console.log('isExist'+loc)),
        map( x => ({lc:loc, isExst:x})),
        mergeMap( x => getLocOption$( x.lc, x.isExst )),
       // tap(x=>console.log('getLocOption')),
        tap( x => !x.isExst ? this.store.dispatch( new AddItem(x.opt)) : null ),
        filter( x => x.isExst)
      ).pipe(          
        map( x => x.opt),
        //tap(x=>console.log('prepareForeignData$')),
        mergeMap( o =>  this.store.select(fromSelectors.selectIsMetadataLoaded(o.name)).pipe(map(x=>({isMdLoaded:x, opt:o })))),
        //tap(x=>console.log(x)),
        tap( x => x.isMdLoaded ? null:  this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItemsMeta()}))),
        //tap(x=>console.log('disp GetItemsMeta$')),
        filter( x => x.isMdLoaded ),
      ).pipe(
        tap( x => isFullIndepended(loc)?
            this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItems(undefined)})):
            null  
        ),
        //tap( x => isFullIndepended(loc)?this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItems(undefined)})):null  ),
        map( x => x.isMdLoaded ),
        
      )
  } 

  // /**
  //  *  подготавливает стор 
  //  */    
  // public prepareForeignData$ = (loc:string) => {  

  //   const getLocOption$ = ( loc:string, isFromStore:boolean ) =>     // либо билдит с эффектами либо из стора если он там есть         
  //     (isFromStore ?  
  //         this.store.select( fromSelectors.selectDataOptions(locationToName(loc))).pipe(take(1) ):
  //         this.buildOptions$( loc ).pipe(tap(x=>console.log('bld')))
  //     ).pipe(

  //       map( x => ({ opt:x, isExst:isFromStore }) )
  //     )

  //   return this.isExist$(loc)
  //     .pipe(
  //       tap(x=>console.log('isExist')),
  //       map( x => ({lc:loc, isExst:x})),
  //       mergeMap( x => getLocOption$( x.lc, x.isExst )),
  //       tap(x=>console.log('getLocOption')),
  //       tap( x => !x.isExst ? this.store.dispatch( new AddItem(x.opt)) : null ),
  //       filter( x => x.isExst)
  //     ).pipe(          
  //       map( x => x.opt),
  //       tap(x=>console.log('prepareForeignData$')),
  //       mergeMap( o =>  this.store.select(fromSelectors.selectIsMetadataLoaded(o.name)).pipe(map(x=>({isMdLoaded:x, opt:o })))),
  //       //tap(x=>console.log(x)),
  //       tap( x => x.isMdLoaded ? null:  this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItemsMeta()}))),
  //       tap(x=>console.log('disp GetItemsMeta$')),
  //       filter( x => x.isMdLoaded ),
  //     ).pipe(
  //       tap( x => isFullIndepended(loc)?
  //           this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItems(undefined)})):
  //           null  
  //       ),
  //       //tap( x => isFullIndepended(loc)?this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItems(undefined)})):null  ),
  //       map( x => x.isMdLoaded ),
        
  //     )
  // }      

  /**
   *  Загружает таргетированную часть данных в стор
   */
  public getItemsPart$ = (loc:string) =>{
    // this.dataService.items$(loc)
    return this.store.select( fromSelectors.selectDataOptionsByLoc(loc)).pipe(
      filter( x => !!x ),
      combineLatest(  this.dataService.items$(loc) , (o,d) => ({opt:o, data:d})),
      //tap( x=> console.log(x) ),
      map( x => ({ entites:x.data , ids: x.data.map( y => x.opt.selectId(y) ) , request:loc})  ),
      //tap( x=> console.log(x) )
    ); 
  }

  

}
