import { Component, OnInit }    from '@angular/core';
import { Store }                from '@ngrx/store';
import { map, tap }                  from 'rxjs/operators';

import * as fromStore           from '@appStore/index';
import * as fromSelectors       from '@appStore/selectors/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Purchase-app';
  spiner$:Observable<boolean> ;
  
  constructor(    
    private store: Store<fromStore.State>
  ) { }

  ngOnInit() {
    this.spiner$ = this.store.select(  fromSelectors.selIsBuzy() );
    
  }

}
