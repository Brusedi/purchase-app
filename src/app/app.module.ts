import { BrowserModule }                from '@angular/platform-browser';
import { NgModule }                     from '@angular/core';

import { AppRoutingModule }             from './app-routing.module';
import { AppComponent }                 from './app.component';

import {NgbModule}                      from '@ng-bootstrap/ng-bootstrap';
import { PurchListComponent }           from './purchase/purch-list/purch-list.component';
import { RouterModule, Routes }         from '@angular/router';
import { NvaPlanPurchaseLine }          from '@appModels/entity-options';
import { AppResolverService }           from './shared/services/app-resolver.service';
import { StoreModule }                  from '@ngrx/store';
import { EffectsModule }                from '@ngrx/effects';
import { 
  StoreRouterConnectingModule, 
  RouterStateSerializer 
}                                       from '@ngrx/router-store';

import { StoreDevtoolsModule }          from '@ngrx/store-devtools';


import { AppSettingsService }           from './shared/services/app-setting.service';
import { DataProvService }              from './shared/services/data-prov.service';
import { CustomRouterStateSerializer }  from '@appStore/router';

import { HttpModule }                   from '@angular/http';
import * as fromStore                   from '@appStore/index';
import { FlatListComponent } from './components/flat-list/flat-list.component';
import { Dictionary } from '@ngrx/entity';
import { PurchListItemComponent } from './purchase/purch-list-item/purch-list-item.component';


const appRoutes: Routes = [
   { path: '',               component: FlatListComponent, pathMatch: 'full', data: { option: NvaPlanPurchaseLine }, resolve: { isLoad:AppResolverService  }   },//,data: {  option: NvaPlanPurchaseLine }, resolve: { isLoad:AppResolverService  } 
   { path: '**',             component: FlatListComponent }
 ];

 // specialItemComponent 
 const itemPresenter : Dictionary<any> = { 
    NvaPlanPurchaseLine:FlatListComponent
  }


@NgModule({
  declarations: [
    AppComponent,
    PurchListComponent,
    FlatListComponent,
    PurchListItemComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    StoreModule.forRoot( fromStore.reducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    EffectsModule.forRoot( fromStore.effects), 
    StoreRouterConnectingModule.forRoot({
        stateKey: 'router' // name of reducer key
    }),

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],

  providers: [
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    AppSettingsService,
    DataProvService,
    AppResolverService//,
    //{ provide:APP_CONFIG , useValue: itemPresenter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
