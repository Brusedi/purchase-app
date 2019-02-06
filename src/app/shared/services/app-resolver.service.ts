import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { filter, take, map, tap, combineLatest, startWith, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { anyEntityOptions, AnyEntity } from '@appModels/any-entity';
import { GetItemsMeta, GetItemsPart, GetItems } from '@appStore/actions/any-entity.actions';
import { SetCurrent, Exec, AddItem, ExecCurrent } from '@appStore/actions/any-entity-set.actions';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { ForeignKeyService } from './foregin/foreign-key.service';

const OPTION_PARAM_DATA_KEY = 'option';

@Injectable({
  providedIn: 'root'
})
export class AppResolverService implements Resolve<any> {

  constructor(
    private store: Store<fromStore.State>,
    private fk:ForeignKeyService
    ) { }

  /**
   *  Воще наверное цепь должна делатся через эффекты,
   *  но в общеобразовательных целях попробуем замонстрячить стрим...
   */
  resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    const opt:anyEntityOptions<AnyEntity> = route.data[OPTION_PARAM_DATA_KEY];

    return this.store.select( fromSelectors.selectIsExist(opt.name))
    .pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        //combineLatest( this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)), (x,y)=> y ), 
        switchMap(() => this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)) ), 
        tap( x => !x ?  this.store.dispatch( new Exec( {name:opt.name , itemAction: new GetItemsMeta() }) ) : null ),
        filter( x => x ),
        //combineLatest( this.store.select( fromSelectors.selCurName()), (x,y)=> y ), 
        switchMap( () => this.store.select( fromSelectors.selCurName()) ),
        tap(x => x != opt.name ? this.store.dispatch( new SetCurrent(opt.name) ) : null ),
        filter( x => x == opt.name ),
        //tap( x=> this.store.dispatch( new Exec( {name:'NvaSdEventType' , itemAction: new GetItemsPart('/Ax/NvaSdEventType?SERVICEDESCID=1') }) )),  // Debug
        //map( x => !!x ),
      ).pipe(           //Load data
        tap(x=>console.log(x)  ),
        tap(x => this.store.dispatch( new ExecCurrent( new GetItems(null)) )  ),
        switchMap(() => this.store.select( fromSelectors.selCurIsDataLoaded()) ), 
        filter( x => !!x ) 
      ).pipe(
        startWith(false),
        take(2)
      );
  }
}
