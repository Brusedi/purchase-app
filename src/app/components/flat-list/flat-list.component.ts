import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-flat-list',
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.css']
})
export class FlatListComponent implements OnInit {

  constructor(    
    private store: Store<fromStore.State>
  ) { }

  public itemsKeys$:  Observable<any[]>;

  ngOnInit() {
    this.itemsKeys$ = this.store.select( fromSelectors.selCurItemIds()).pipe( filter( x => !!x))  ;
  }

}
