import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import { Observable, of } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import { filter, tap, delay, switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { toPurchMethodDescr, toLawDescr, toStateDescr, toCyrDescr } from '../purchase-helper';
import { PrepareByLoc, AddItem, PartLoadByLoc } from '@appStore/actions/any-entity-set.actions';
import { NVA_EX_PlanPurch_Docs } from '@appModels/entity-options';
import { locationToName } from 'app/shared/services/foregin/foreign-key.helper';

@Component({
  selector: 'app-purch-list-item',
  templateUrl: './purch-list-item.component.html',
  styleUrls: ['./purch-list-item.component.css']
})



export class PurchListItemComponent implements OnInit {

  @Input() itemId:any;

  public item$:  Observable<{}>;
  public docs$:  Observable<{}>;

  

  constructor(
    private store: Store<fromStore.State>
    ) { }

  ngOnInit() {
    
    const location = NVA_EX_PlanPurch_Docs.location + "?REFRECID="+this.itemId;
    //console.log('dispatch !!!');
    //this.store.dispatch( new PrepareByLoc(location));
    //this.store.dispatch( new PrepareByLoc(NVA_EX_PlanPurch_Docs.location + "?VALUERECID="+this.itemId)) ;       //Prepare store for store reference documents
    //this.store.dispatch( new PrepareByLoc(location));
    this.store.dispatch( new PartLoadByLoc(location));

    // this.store.select( fromSelectors.selectIsExist(NVA_EX_PlanPurch_Docs.name))
    //   .pipe(
    //       //tap( x => !x ?  this.store.dispatch( new PrepareByLoc(location)) : null ),
    //       filter( x => x ),
    //       //tap( x => this.store.dispatch( new PartLoadByLoc(location)) ),
    //   ).subscribe(x => {console.log(x); console.log(location)});


    this.item$ = this.store.select( fromSelectors.selCurItemById(this.itemId)).pipe(filter( x => !!x)) ;
    this.docs$ = this.store.select( fromSelectors.selectForeignDataByLoc(location)).pipe(
      filter(x=>!!x),
      map(x=>Object.keys(x).map(y=> x[y]))
    );

    //this.docs$.pipe(distinctUntilChanged()).subscribe(x=>console.log(x));
  }

  initPurchDoc(){

  } 

  public toPurchMethDescr = (m:number,d:number) => ( toPurchMethodDescr(m) + (d?" в электронной форме ":""));
  public  toStateDescr =  toStateDescr;
  public  toLawDescr =  toLawDescr;
  public  toCyrDescr =  toCyrDescr;
  
  
}
