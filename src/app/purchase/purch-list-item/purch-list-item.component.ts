import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import { Observable } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import { filter, tap, delay } from 'rxjs/operators';
import { toPurchMethodDescr, toLawDescr, toStateDescr, toCyrDescr } from '../purchase-helper';

@Component({
  selector: 'app-purch-list-item',
  templateUrl: './purch-list-item.component.html',
  styleUrls: ['./purch-list-item.component.css']
})



export class PurchListItemComponent implements OnInit {

  @Input() itemId:any;

  public item$:  Observable<{}>;

  

  constructor(
    private store: Store<fromStore.State>
    ) { }

  ngOnInit() {
    this.item$ = this.store.select( fromSelectors.selCurItemById(this.itemId)).pipe( delay(1000), tap(x=>console.log(x) ), filter( x => !!x)) ;
    
  }

  public toPurchMethDescr = (m:number,d:number) => ( toPurchMethodDescr(m) + (d?" в электронной форме ":""));
  public  toStateDescr =  toStateDescr;
  public  toLawDescr =  toLawDescr;
  public  toCyrDescr =  toCyrDescr;
  
  
}
